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
  RenderLeafProps,
} from "slate-react";
import {
  Editor,
  createEditor,
  Element as SlateElement,
  Transforms,
  NodeEntry,
  Node,
} from "slate";
import { withHistory } from "slate-history";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import TitleIcon from "@mui/icons-material/Title";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PhotoIcon from "@mui/icons-material/Photo";
import DataObjectIcon from "@mui/icons-material/DataObject";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import LinkDialog from "./LinkDialog";
import { css } from "@emotion/css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-css";
import "prismjs/components/prism-cshtml";
import "prismjs/components/prism-bash";

import { Button, Toolbar } from "../components";
import styles from "../../styles/editor/Editor.module.scss";
import { serialize, toSlateJson } from "../../utils/format";
import { CodeBlockElement } from "../../types/editor";
import { normalizeTokens, languages } from "../../utils/prism";
import prismThemeCss from "../../styles/editor/prismThemeCss";
import textStyleCss from "../../styles/editor/textStyle";

interface Props {
  fromAnswer?: boolean;
  slateJson?: string[];
  uploadImage?: (file: File) => Promise<any>;
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
  const [value, setValue] = useState(initialValue);
  const [showSlate, setShowSlate] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);

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

  const renderElement = useCallback(
    (scopedProps) => {
      const { attributes, children, element } = scopedProps;
      // cutomize elemtents: https://docs.slatejs.org/walkthroughs/03-defining-custom-elements
      if (element.type === "codeBlock") {
        const setLanguage = (event: SelectChangeEvent) => {
          const path = ReactEditor.findPath(editor, element);
          (Transforms as any).setNodes(
            editor,
            { language: event.target.value as string },
            { at: path }
          );
        };
        return (
          <div
            {...attributes}
            className={css(`
        font-family: monospace;
        font-size: 16px;
        line-height: 20px;
        margin-top: 0;
        background: rgba(0, 20, 60, .03);
        padding: 8px 16px;
        min-height: 64px;
      `)}
            style={{ position: "relative" }}
            spellCheck={false}
          >
            {props.fromAnswer ? null : (
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                  position: "absolute",
                  right: "0px",
                  top: "0px",
                  zIndex: 99,
                }}
                size="small"
              >
                <InputLabel id="demo-select-small-label">Language</InputLabel>
                <Select value={element.language} label="Language" onChange={setLanguage}>
                  {languages.map((item) => {
                    return (
                      <MenuItem value={item.value} key={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
            {children}
          </div>
        );
      }

      // bind "token" class to codeLine type
      if (element.type === "codeLine") {
        return (
          <div {...attributes} style={{ position: "relative" }}>
            {children}
          </div>
        );
      }
      return <Element {...scopedProps} />;
    },
    [props.fromAnswer]
  );

  const renderLeaf = (props: RenderLeafProps) => {
    const { attributes, children, leaf } = props;
    const { text, ...rest } = leaf;

    return (
      <span {...attributes} className={Object.keys(rest).join(" ")}>
        {children}
      </span>
    );
  };

  // withHistory: tracks changes to the Slate value state over time, and enables undo and redo functionality.
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  // decorate function depends on the language selected
  const useDecorate = (editor: Editor) => {
    return useCallback(
      ([node, path]) => {
        if (SlateElement.isElement(node) && (node as any).type === "codeLine") {
          const ranges = (editor as any).nodeToDecorations.get(node) || [];
          return ranges;
        }

        return [];
      },
      [(editor as any).nodeToDecorations]
    );
  };

  const decorate = useDecorate(editor);

  const renderToolbar = () => {
    return (
      <Toolbar className={styles.toolbar}>
        <MarkButton format="bold" icon={() => <FormatBoldIcon />} />
        <MarkButton format="italic" icon={() => <FormatItalicIcon />} />
        <MarkButton format="underline" icon={() => <FormatUnderlinedIcon />} />
        <MarkButton format="codeInline" icon={() => <DataObjectIcon />} />
        <BlockButton format="codeBlock" icon={() => <CodeIcon />} />
        <BlockButton format="headingOne" icon={() => <TitleIcon />} />
        <BlockButton
          format="headingTwo"
          icon={() => <TitleIcon className={styles.toolbarSubtitle} />}
        />
        <BlockButton format="blockQuote" icon={() => <FormatQuoteIcon />} />
        <BlockButton format="numberedList" icon={() => <FormatListNumberedIcon />} />
        <BlockButton format="bulletedList" icon={() => <FormatListBulletedIcon />} />
        <InsertLinkButton format="link" icon={() => <InsertLinkIcon />} />
        <InsertImageButton format="image" icon={() => <PhotoIcon />} />
      </Toolbar>
    );
  };

  const handleUploadClick = (event: any, editor: any) => {
    const file = event.target.files[0];
    if (file.name.length > 20) {
      return;
    }
    if (!["image/jpg", "image/png", "image/jpeg"].includes(file.type)) {
      return;
    }
    if (props.uploadImage) {
      props.uploadImage(file).then((res) => {
        if (res && res.url) {
          insertImage(editor, res.url);
        }
      });
    }
  };

  const InsertImageButton = ({ format, icon }: any) => {
    const editor = useSlateStatic();
    return (
      <Button className="relative">
        <input
          accept="image/*"
          type="file"
          onChange={(e: any) => handleUploadClick(event, editor)}
          className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-0"
        />
        {icon()}
      </Button>
    );
  };

  const showInsertLinkDialog = (editor: any) => {
    setShowLinkDialog(true);
  };

  const insertLink = (editor, form) => {
    console.log(editor, form);
  };

  const InsertLinkButton = ({ format, icon }: any) => {
    const editor = useSlateStatic();
    return (
      <Button className="relative" onClick={() => showInsertLinkDialog(editor)}>
        {icon()}
      </Button>
    );
  };

  const renderSlate = () => {
    // Only render editor on client side.
    if (showSlate) {
      return (
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(value: any) => {
            const isAstChange = editor.operations.some((op: any) => "set_selection" !== op.type);
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
          <SetNodeToDecorations />
          <Editable
            className="editable-area"
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
          <LinkDialog
            open={showLinkDialog}
            setOpen={setShowLinkDialog}
            onSubmit={(formJson) => insertLink(editor, formJson)}
          />
          <style>{prismThemeCss}</style>
          <style>{textStyleCss}</style>
        </Slate>
      );
    }
    return null;
  };

  return (
    <div className={styles.editorWrapper}>
      <div
        className={styles.editor}
        style={{ minHeight: props.fromAnswer ? "85vh" : "100vh", height: "100%" }}
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

  // handle codeBlock type
  if (format === "codeBlock") {
    if (!isActive) {
      (Transforms as any).wrapNodes(
        editor,
        { type: "codeBlock", language: "typescript", children: [] },
        {
          match: (n: any) => SlateElement.isElement(n) && (n as any).type === "paragraph",
          split: true,
        }
      );
      (Transforms as any).setNodes(
        editor,
        { type: "codeLine" },
        { match: (n: any) => SlateElement.isElement(n) && (n as any).type === "paragraph" }
      );
    } else {
      Transforms.unwrapNodes(editor, {
        match: (n: any) => {
          return (
            !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === "codeBlock"
          );
        },
        split: true,
      });
      (Transforms as any).setNodes(editor, { type: "paragraph" });
    }

    return;
  }

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
      match: (n: any) => {
        return !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any)[blockType] === format;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: any, format: any) => {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[format] === true : false;
};

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m as any) {
      map.set(item[0], item[1]);
    }
  }
  return map;
};

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CodeBlockElement>) => {
  const nodeToDecorations = new Map<SlateElement, Range[]>();

  const text = block.children.map((line) => Node.string(line)).join("\n");
  const language = block.language;
  const tokens = Prism.tokenize(text, Prism.languages[language]);
  const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
  const blockChildren = block.children as SlateElement[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map((type) => [type, true])),
      };

      nodeToDecorations.get(element)!.push(range as any);

      start = end;
    }
  }
  return nodeToDecorations;
};

// precalculate editor.nodeToDecorations map to use it inside decorate function then
const SetNodeToDecorations = () => {
  const editor: any = useSlate();

  const blockEntries: any = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: "highest",
      match: (n) => SlateElement.isElement(n) && (n as any).type === "codeBlock",
    })
  );

  const nodeToDecorations = mergeMaps(...blockEntries.map(getChildNodeToDecorations));

  editor.nodeToDecorations = nodeToDecorations;

  return null;
};

const ImageElement = ({ attributes, children, element }: any) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor as any, element);

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

const insertImage = (editor: any, url: string) => {
  const text = { text: "" };
  const image: ImageElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
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
      { text: "<textarea>", codeInline: true },
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
