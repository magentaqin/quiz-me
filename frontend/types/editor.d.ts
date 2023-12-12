import { Descendant } from 'slate'

export type CodeBlockElement = {
  type: 'code-block'
  language: string
  children: Descendant[]
}