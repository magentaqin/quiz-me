import Button from "@mui/material/Button";
import { convertStringToFile } from "../../utils/file";
import { compileCodeApi } from "../../api/task";

interface Props {
  value?: string;
}

const Action = (props: Props) => {
  const runCode = () => {
    const file = convertStringToFile(props.value);
    if (file) {
      compileCodeApi({ file });
    }
  };
  const submit = () => {};
  return (
    <div>
      <Button size="small" onClick={runCode}>
        Run
      </Button>
      <Button size="small" onClick={submit}>
        Submit
      </Button>
    </div>
  );
};

export default Action;
