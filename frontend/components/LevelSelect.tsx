import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const levels = ["ENTRY", "MID", "HIGH"];

interface Props {
  level: string;
  setSelectedLevel: (level: string) => void;
}

export default function MultipleSelectChip(props: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setSelectedLevel(event.target.value as string);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} style={{ marginTop: "20px", marginLeft: "0px" }}>
        <InputLabel id="multiple-chip-label" size="small">
          Level
        </InputLabel>
        <Select
          labelId="question-level-select-label"
          id="question-level-select-label"
          size="small"
          value={props.level}
          label="Level"
          onChange={handleChange}
        >
          {levels.map((item) => {
            return (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
