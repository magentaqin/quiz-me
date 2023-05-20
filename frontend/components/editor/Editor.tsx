import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import Prism from "prismjs";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSlateStatic,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { Editor, createEditor, Element as SlateElement, Text, Transforms } from "slate";
import { withHistory } from "slate-history";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import TitleIcon from "@mui/icons-material/Title";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PhotoIcon from "@mui/icons-material/Photo";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { css } from "@emotion/css";

import { Button, Toolbar } from "../components";
import styles from "../../styles/Editor.module.scss";
import { serialize, toSlateJson } from "../../utils/format";

interface Props {
  fromAnswer?: boolean;
  slateJson?: string[];
}

const HOTKEYS: any = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

export type EmptyText = {
  text: string;
};

export type ImageElement = {
  type: "image";
  url: string;
  children: EmptyText[];
};

const getLength = (token: any) => {
  if (typeof token === "string") {
    return token.length;
  } else if (typeof token.content === "string") {
    return token.content.length;
  } else {
    return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
  }
};

const RichTextEditor = (props: Props) => {
  const [language, setLanguage] = useState("js");
  const [value, setValue] = useState(initialValue);
  const [showSlate, setShowSlate] = useState(false);

  // Update the initial content to be pulled from Local Storage if it exists.
  useEffect(() => {
    const cache = localStorage.getItem("content");
    console.log("cache", cache);
    if (cache) {
      setValue(JSON.parse(cache));
    }
    setShowSlate(true);
  }, []);

  useEffect(() => {
    if (props.slateJson) {
      setValue(props.slateJson);
    }
  }, [props.slateJson]);

  const renderElement = useCallback((props) => {
    // cutomize elemtents: https://docs.slatejs.org/walkthroughs/03-defining-custom-elements
    if (props.element.children[0].code) {
      return (
        <p
          {...props.attributes}
          style={{
            backgroundColor: "#ddd",
            padding: "4px 8px",
            margin: 0,
          }}
          className="slate-code-block"
        >
          {props.children}
        </p>
      );
    }
    return <Element {...props} />;
  }, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const withImages = (editor: any) => {
    const { insertData, isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === "image" ? true : isVoid(element);
    };

    editor.insertData = (data) => {
      const text = data.getData("text/plain");
      const { files } = data;

      if (files && files.length > 0) {
        for (const file of files) {
          const reader = new FileReader();
          const [mime] = file.type.split("/");

          if (mime === "image") {
            reader.addEventListener("load", () => {
              const url = reader.result;
              insertImage(editor, url);
            });

            reader.readAsDataURL(file);
          }
        }
      } else if (isImageUrl(text)) {
        insertImage(editor, text);
      } else {
        insertData(data);
      }
    };

    return editor;
  };

  // withHistory: tracks changes to the Slate value state over time, and enables undo and redo functionality.
  const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

  // decorate function depends on the language selected
  const decorate = useCallback(
    ([node, path]) => {
      const ranges: any = [];
      if (!Text.isText(node)) {
        return ranges;
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language]);
      let start = 0;

      for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;

        if (typeof token !== "string") {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }

        start = end;
      }

      return ranges;
    },
    [language]
  );

  const renderToolbar = () => {
    return (
      <Toolbar className={styles.toolbar}>
        <MarkButton format="bold" icon={() => <FormatBoldIcon />} />
        <MarkButton format="italic" icon={() => <FormatItalicIcon />} />
        <MarkButton format="underline" icon={() => <FormatUnderlinedIcon />} />
        <MarkButton format="codeInline" icon={() => <DataObjectIcon />} />
        <MarkButton format="code" icon={() => <CodeIcon />} />
        <BlockButton format="headingOne" icon={() => <TitleIcon />} />
        <BlockButton
          format="headingTwo"
          icon={() => <TitleIcon className={styles.toolbarSubtitle} />}
        />
        <BlockButton format="blockQuote" icon={() => <FormatQuoteIcon />} />
        <BlockButton format="numberedList" icon={() => <FormatListNumberedIcon />} />
        <BlockButton format="bulletedList" icon={() => <FormatListBulletedIcon />} />
        <InsertImageButton format="image" icon={() => <PhotoIcon />} />
      </Toolbar>
    );
  };

  const renderSlate = () => {
    // Only render editor on client side.
    if (showSlate) {
      return (
        <Slate
          editor={editor}
          value={value}
          onChange={(value: any) => {
            const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);
            if (isAstChange) {
              // Save the value to Local Storage.
              const content = JSON.stringify(value);
              localStorage.setItem("content", content);
              console.log("editor value", value);
              const serializedVal = serialize({ children: value });
              console.log("htmlstring", serializedVal);
              console.log("slate json", toSlateJson(serializedVal));
            }
          }}
        >
          {props.fromAnswer ? null : renderToolbar()}
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            decorate={decorate}
            placeholder="Enter some rich text…"
            readOnly={props.fromAnswer}
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </Slate>
      );
    }
    return null;
  };

  return (
    <div className={styles.editorWrapper}>
      <div
        className={styles.editor}
        style={{ minHeight: props.fromAnswer ? "85vh" : "63vh", height: "100%" }}
      >
        {renderSlate()}
      </div>
    </div>
  );
};

const toggleBlock = (editor: any, format: any) => {
  const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
  const LIST_TYPES: any = ["numberedList", "bulletedList"];
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  ) as boolean;
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: any) => {
      return (
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes((n as any).type) &&
        !TEXT_ALIGN_TYPES.includes(format)
      );
    },
    split: true,
  });
  let newProperties = {};
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "listItem" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: any, format: any, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: any, format: any) => {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[format] === true : false;
};

const ImageElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        className={css`
          position: relative;
        `}
      >
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? "0 0 0 3px #B4D5FF" : "none"};
          `}
        />
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={css`
            display: ${selected && focused ? "inline" : "none"};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
        >
          <p>delete</p>
        </Button>
      </div>
    </div>
  );
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "blockQuote":
      return (
        <blockquote {...attributes}>
          <p>{children}</p>
        </blockquote>
      );
    case "bulletedList":
      return <ul {...attributes}>{children}</ul>;
    case "headingOne":
      return <h1 {...attributes}>{children}</h1>;
    case "headingTwo":
      return <h2 {...attributes}>{children}</h2>;
    case "listItem":
      return <li {...attributes}>{children}</li>;
    case "numberedList":
      return <ol {...attributes}>{children}</ol>;
    case "image":
      return <ImageElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const renderCode = (attributes: any, children: any, leaf: any) => {
  return (
    <span
      {...attributes}
      className={css`
        font-family: monospace;
        background: #ddd;

        ${leaf.comment &&
        css`
          color: slategray;
        `}

        ${(leaf.operator || leaf.url) &&
        css`
          color: #9a6e3a;
        `}
      ${leaf.keyword &&
        css`
          color: #07a;
        `}
      ${(leaf.variable || leaf.regex) &&
        css`
          color: #e90;
        `}
      ${(leaf.number ||
          leaf.boolean ||
          leaf.tag ||
          leaf.constant ||
          leaf.symbol ||
          leaf["attr-name"] ||
          leaf.selector) &&
        css`
          color: #905;
        `}
      ${leaf.punctuation &&
        css`
          color: #999;
        `}
      ${(leaf.string || leaf.char) &&
        css`
          color: #690;
        `}
      ${(leaf.function || leaf["class-name"]) &&
        css`
          color: #dd4a68;
        `}
      `}
    >
      {children}
    </span>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = renderCode(attributes, children, leaf);
  }

  if (leaf.codeInline) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon()}
    </Button>
  );
};

// test image url: https://i.pinimg.com/originals/bd/01/39/bd0139965d5cf92a73cd374fd8d98c90.jpg
const isImageUrl = (url: string) => {
  if (!url) return false;
  const ext: any = new URL(url).pathname.split(".").pop();
  return ["png", "jpeg", "jpg"].includes(ext);
};

const insertImage = (editor: any, url: string) => {
  const text = { text: "" };
  const image: ImageElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const handleUploadClick = (event: any) => {
  const file = event.target.files[0];
};

const InsertImageButton = ({ format, icon }: any) => {
  const editor = useSlateStatic();
  return (
    <Button
      className="relative"
      onMouseDown={(event: Event) => {
        // event.preventDefault();
        // const url = window.prompt("Enter the URL of the image:");
        // if (url && !isImageUrl(url)) {
        //   alert("URL is not an image");
        //   return;
        // }
        // url && insertImage(editor, url);
      }}
    >
      <input
        accept="image/*"
        type="file"
        onChange={handleUploadClick}
        className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-0"
      />
      {icon()}
    </Button>
  );
};

const MarkButton = ({ format, icon }: any) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon()}
    </Button>
  );
};

const initialValue: any[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "center",
    children: [{ text: "Try it out for yourself!" }],
  },
];

export default RichTextEditor;
