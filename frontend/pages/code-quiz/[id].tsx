import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("../../components/code-editor/CodeEditor"), { ssr: false });

const CodeQuizPage = () => {
  return (
    <div>
      <div>
        <h1>Quiz</h1>
      </div>
      <CodeEditor />
    </div>
  );
};

export default CodeQuizPage;
