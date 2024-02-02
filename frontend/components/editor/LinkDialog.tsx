import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface LinkFormJson {
  linkText: string;
  linkUrl: string;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (formJson: LinkFormJson) => void;
}

const LinkDialog = (props: Props) => {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries()) as LinkFormJson;
            props.onSubmit(formJson);
          },
        }}
      >
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="link-text"
            name="linkText"
            label="Link Text"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="link-url"
            name="linkUrl"
            label="Link URL"
            type="url"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default LinkDialog;
