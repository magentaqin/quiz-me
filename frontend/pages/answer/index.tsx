import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import styles from '../../styles/Editor.module.scss'

const Answer = () => {
const value = useMemo(
    () =>
        JSON.parse(localStorage.getItem('content')) || initialValue,
    []
  )
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editor}>
      <Slate editor={editor} value={value} >
        <Editable readOnly placeholder="Enter some plain text..." />
      </Slate>
      </div>
    </div>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows what happens when the Editor is set to readOnly, it is not editable',
      },
    ],
  },
]

export default Answer
