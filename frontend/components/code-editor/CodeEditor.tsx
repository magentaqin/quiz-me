import Editor from "@monaco-editor/react";
import { useState } from "react";

const mockedVal = `
/**
* @param {number[]} nums
* @param {number} target
* @return {number[]}
*/
var twoSum = function(nums, target) {
 console.log('1111')
};`;

const CodeEditor = () => {
  const [value, setValue] = useState(mockedVal);

  const handleChange = (val?: string) => {
    console.log("val", val);
    setValue(val);
  };

  return (
    <Editor height="90vh" defaultLanguage="javascript" value={value} onChange={handleChange} />
  );
};

export default CodeEditor;
