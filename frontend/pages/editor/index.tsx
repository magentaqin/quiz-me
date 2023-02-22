import dynamic from "next/dynamic";

const EditorPage = () => {
  const Editor = dynamic(() => import("./Editor"), { ssr: false });
  return <Editor />;
};

export default EditorPage;
