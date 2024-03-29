import escapeHtml from "escape-html";
import { Text } from "slate";
import { jsx } from "slate-hyperscript";

interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  codeInline?: boolean;
}

interface ElementNode {
  type?: string;
  children: TextNode[];
  url?: string;
  language?: string;
}

// transform slate json-format to html string
export const serialize = (node: ElementNode | TextNode) => {
  console.log("serialize", node);
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<i>${string}</i>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.codeInline) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children: string = node.children.map((n) => serialize(n)).join("");
  switch (node.type) {
    case "blockQuote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "headingOne":
      return `<h1>${children}</h1>`;
    case "headingTwo":
      return `<h2>${children}</h2>`;
    case "numberedList":
      return `<ol>${children}</ol>`;
    case "bulletedList":
      return `<ul>${children}</ul>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "image":
      return `<img src=${node.url} />`;
    case "codeBlock":
      return `<code-block language=${node.language}>${children}</code-block>`;
    case "codeLine":
      return `<code-line>${children}</code-line>`;
    case "link":
      return `<a href="${node.url}" target="_blank">${children}</a>`;
    default:
      return children;
  }
};

// transform html to slate json format
export const toSlateJson = (html: string) => {
  // html string to DOM document
  const document = new DOMParser().parseFromString(html, "text/html");
  return deserialize(document.body);
};

// transform DOM body to slate json format
const deserialize = (el: HTMLElement, markAttributes = {}): any => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx("text", markAttributes, el.textContent);
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes: any = { ...markAttributes };

  // define attributes for text nodes
  switch (el.nodeName) {
    case "strong":
      nodeAttributes.bold = true;
  }

  const children = Array.from(el.childNodes)
    .map((node: any) => deserialize(node, nodeAttributes))
    .flat();

  if (children.length === 0) {
    children.push(jsx("text", nodeAttributes, ""));
  }

  switch (el.nodeName) {
    case "BODY":
      return jsx("fragment", {}, children);
    case "BR":
      return "\n";
    case "BLOCKQUOTE":
      return jsx("element", { type: "blockQuote" }, children);
    case "P":
      return jsx("element", { type: "paragraph" }, children);
    case "H1":
      return jsx("element", { type: "headingOne" }, children);
    case "H2":
      return jsx("element", { type: "headingTwo" }, children);
    case "OL":
      return jsx("element", { type: "numberedList" }, children);
    case "UL":
      return jsx("element", { type: "bulletedList" }, children);
    case "LI":
      return jsx("element", { type: "listItem" }, children);
    case "A":
      return jsx("element", { type: "link", url: el.getAttribute("href") }, children);
    case "I": // italic
      return jsx("text", { ...children[0], italic: true });
    case "U": // underline
      return jsx("text", { ...children[0], underline: true });
    case "STRONG": // bold text
      return jsx("text", { ...children[0], bold: true });
    case "CODE": // code inline
      return jsx("text", { ...children[0], codeInline: true });
    case "IMG":
      return jsx("element", { type: "image", url: (el as any).src }, children);
    case "CODE-BLOCK":
      return jsx(
        "element",
        { type: "codeBlock", language: (el as any).getAttribute("language") },
        children
      );
    case "CODE-LINE": // each line in CodeBlock
      return jsx("element", { type: "codeLine" }, children);
    default:
      return children;
  }
};
