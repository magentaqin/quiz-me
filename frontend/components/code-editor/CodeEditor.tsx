import Editor from "@monaco-editor/react";
import { useState } from "react";

interface Props {
  defaultValue?: string;
}

const CodeEditor = (props: Props) => {
  const [value, setValue] = useState(props.defaultValue);

  const handleChange = (val?: string) => {
    console.log("val", val);
    setValue(val);
  };

  return (
    <Editor height="90vh" defaultLanguage="javascript" value={value} onChange={handleChange} />
  );
};

export default CodeEditor;
