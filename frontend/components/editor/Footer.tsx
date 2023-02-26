import Button from "@mui/material/Button";

interface Props {
  onSubmit: () => void;
}

const Footer = (props: Props) => {
  const onSubmit = () => {
    props.onSubmit();
  };
  return (
    <div className="h-16 fixed bottom-0 left-0 right-0 bg-white pt-4 pb-4 shadow-2xl z-40">
      <Button
        size="small"
        variant="contained"
        style={{ position: "absolute", right: "16px", backgroundColor: "#1976d2" }}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default Footer;
