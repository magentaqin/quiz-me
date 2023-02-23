import React, { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import Prism from "prismjs";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, createEditor, Element as SlateElement, Text } from "slate";
import { withHistory } from "slate-history";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import CodeIcon from "@mui/icons-material/Code";
import TitleIcon from "@mui/icons-material/Title";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { css } from "@emotion/css";

import { Button, Toolbar } from "../components";
import styles from "../../styles/Editor.module.scss";
import { serialize, toSlateJson } from "../../utils/format";

interface Props {
  fromAnswer?: boolean;
}

const HOTKEYS: any = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
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
  const [htmlString, setHtmlString] = useState("");
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

  const renderElement = useCallback((props) => {
    // cutomize elemtents: https://docs.slatejs.org/walkthroughs/03-defining-custom-elements
    if (props.element.children[0].code) {
      return (
        <div
          {...props.attributes}
          style={{ backgroundColor: "#ddd", margin: 0, padding: "4px 8px" }}
        >
          {props.children}
        </div>
      );
    }
    return <Element {...props} />;
  }, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // withHistory: tracks changes to the Slate value state over time, and enables undo and redo functionality.
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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

  const submit = () => {
    console.log("submit!", htmlString);
  };

  const renderToolbar = () => {
    return (
      <Toolbar className={styles.toolbar}>
        <button onClick={submit}>Submit</button>
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
              setHtmlString(serializedVal);
              console.log("htmlstring", serializedVal);
              console.log("slate json", toSlateJson(serializedVal));
            }
          }}
        >
          { props.fromAnswer ? null : renderToolbar()}
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
      <div className={styles.editor}>{renderSlate()}</div>
    </div>
  );
};

const toggleBlock = (editor: any, format: any) => {};

const toggleMark = (editor: any, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: any, format: any) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n: any) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
  }) as any;

  return !!match;
};

const isMarkActive = (editor: any, format: any) => {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
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
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default RichTextEditor;
