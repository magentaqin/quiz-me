import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import Prism from 'prismjs'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  Text,
} from 'slate'
import { withHistory } from 'slate-history'
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import TitleIcon from '@mui/icons-material/Title';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { css } from '@emotion/css'

import { Button, Toolbar } from './components'
import styles from '../../styles/Editor.module.scss'
import { serialize, toSlateJson } from './utils/format'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const getLength = token => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else {
    return token.content.reduce((l, t) => l + getLength(t), 0)
  }
}

const RichTextEditor = () => {
  const [language, setLanguage] = useState('js')
  // Update the initial content to be pulled from Local Storage if it exists.
  const value = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || initialValue,
    []
  )
  const renderElement = useCallback(props => {
    // cutomize elemtents: https://docs.slatejs.org/walkthroughs/03-defining-custom-elements
    if (props.element.children[0].code) {
      return <div {...props.attributes} style={{backgroundColor: '#ddd', margin: 0, padding: '4px 8px'}}>{props.children}</div>
    }
    return (
      <Element {...props} />
    )
  }, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  // withHistory: tracks changes to the Slate value state over time, and enables undo and redo functionality.
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // decorate function depends on the language selected
  const decorate = useCallback(
    ([node, path]) => {
      const ranges: any = []
      if (!Text.isText(node)) {
        return ranges
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language])
      let start = 0

      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }

        start = end
      }

      return ranges
    },
    [language]
  )

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editor}>
        <Slate 
          editor={editor} 
          value={value} 
          onChange={value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value)
            localStorage.setItem('content', content)
            console.log('editor value', value)
            const serializedVal = serialize({ children: value })
            console.log('slate json', toSlateJson(serializedVal))
          }
        }}>
        <Toolbar className={styles.toolbar}>
          <MarkButton format="bold" icon={() => <FormatBoldIcon />} />
          <MarkButton format="italic" icon={() => <FormatItalicIcon /> } />
          <MarkButton format="underline" icon={() => <FormatUnderlinedIcon />} />
          <MarkButton format="codeInline" icon={() => <DataObjectIcon /> } />
          <MarkButton format="code" icon={() => <CodeIcon /> } />
          <BlockButton format="heading-one" icon={() => <TitleIcon />} />
          <BlockButton format="heading-two" icon={() => <TitleIcon className={styles.toolbarSubtitle} />}/>
          <BlockButton format="block-quote" icon={() => <FormatQuoteIcon />} />
          <BlockButton format="numbered-list" icon={() => <FormatListNumberedIcon />} />
          <BlockButton format="bulleted-list" icon={() => <FormatListBulletedIcon />} />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          decorate={decorate}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
        </Slate>
      </div>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const renderCode = (attributes, children, leaf) => {
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
        leaf['attr-name'] ||
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
      ${(leaf.function || leaf['class-name']) &&
        css`
          color: #dd4a68;
        `}
      `}
  >
    {children}
  </span>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = renderCode(attributes, children, leaf)
  }

  if (leaf.codeInline) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon()}
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon()}
    </Button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', 'codeInline': true },
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
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default RichTextEditor