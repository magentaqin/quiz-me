import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
interface Props {
  onSubmit: () => void;
  cancel: () => void;
}

const Footer = (props: Props) => {
  const onSubmit = () => {
    props.onSubmit();
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-16 pt-4 pb-4 bg-white shadow-2xl">
      <Stack direction="row" spacing={3} style={{position: "absolute", right: "16px",}}>
        <Button variant="text" size="small" onClick={props.cancel}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          style={{ backgroundColor: "#1976d2" }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Stack>
    </div>
  );
};

export default Footer;
