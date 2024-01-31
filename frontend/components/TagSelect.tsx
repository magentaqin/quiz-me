import * as React from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { TagItem } from "../api/tag";

interface Props {
  selectedTags: TagItem[];
  setSelectedTags: (tags: TagItem[]) => void;
  tags: TagItem[];
}

export default function MultipleSelectChip(props: Props) {
  const handleChange = (_, newValue: TagItem[]) => {
    props.setSelectedTags(newValue);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }} style={{ marginTop: "20px", marginLeft: "0px" }}>
      <Autocomplete
        multiple
        size="small"
        id="question-tags"
        options={props.tags}
        sx={{ width: 540, height: 50 }}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.tagId === value.tagId}
        filterSelectedOptions
        value={props.selectedTags}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label="Tags" />}
      />
    </FormControl>
  );
}
