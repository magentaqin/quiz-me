import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tags = [
  "javascript",
  "ecmascript-6",
  "typescript",
  "reactjs",
  "vue.js",
  "html",
  "css",
  "dom",
  "monorepo",
  "lerna",
  "webpack",
  "babeljs",
  "mysql",
  "node.js",
];

function getStyles(name: string, selectedTags: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedTags.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface Props {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function MultipleSelectChip(props: Props) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof props.selectedTags>) => {
    const {
      target: { value },
    } = event;
    props.setSelectedTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} style={{ marginTop: "20px", marginLeft: "0px" }}>
        <InputLabel id="multiple-chip-label" size="small">
          Tags
        </InputLabel>
        <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          size="small"
          multiple
          value={props.selectedTags}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag} style={getStyles(tag, props.selectedTags, theme)}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
