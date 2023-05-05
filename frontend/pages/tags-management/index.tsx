import type { NextPage } from "next";
import { Fragment, useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import NavBar from "../../components/Navbar";

const TagsManagement: NextPage = () => {
  const frontendList = [
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
  ];

  const backendList = ["nodejs", "mysql", "docker"];
  const initialTags: any = {}
  frontendList.concat(backendList).forEach(key => {
    initialTags[key] = true
  })

  const [formData, setFormData] = useState({});
  const [tags, setTags] = useState<{[key: string]: boolean}>(initialTags)


  const onChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newFormData = {
      ...formData,
      [key]: event.target.value,
    };
    setFormData(newFormData);
  };

  const toggleCheckbox = (key: string,
    event: React.ChangeEvent<HTMLInputElement>) => {
      const newTags = {
        ...tags,
        [key]: event.target.checked,
      };
      setTags(newTags)
  }

  const renderFrontTags = () => {
    return frontendList.map((item) => {
      return (
        <div key={item} className="flex items-center">
          <FormControlLabel
            control={<Checkbox checked={tags[item]} onChange={(event) => toggleCheckbox(item, event)} />}
            label={item}
            style={{ width: "200px" }}
          />
          <TextField
            id="tag-description"
            label="Description"
            variant="standard"
            style={{ width: "600px" }}
            onChange={(event) => onChange(item, event)}
          />
        </div>
      );
    });
  };

  const renderBackendTags = () => {
    return backendList.map((item) => {
      return (
        <div key={item} className="flex items-center">
          <FormControlLabel
            control={<Checkbox checked={tags[item]} onChange={(event) => toggleCheckbox(item, event)} />}
            label={item}
            style={{ width: "200px" }}
          />
          <TextField
            id="tag-description"
            label="Description"
            variant="standard"
            style={{ width: "600px" }}
            onChange={(event) => onChange(item, event)}
          />
        </div>
      );
    });
  };

  const submit = () => {
    console.log('desc', formData);
    console.log('tags', tags)
  };

  return (
    <Fragment>
      <NavBar />
      <div className="container px-4 mx-auto">
        <p className="text-2xl">Manage Tags</p>
        <div>
          <p className="text-xl">Frontend</p>
          <FormGroup>{renderFrontTags()}</FormGroup>
        </div>
        <div>
          <p className="text-xl">Backend</p>
          <FormGroup>{renderBackendTags()}</FormGroup>
        </div>
        <Button
          variant="contained"
          size="small"
          onClick={submit}
          style={{ backgroundColor: "#1976d2" }}
        >
          Submit
        </Button>
      </div>
    </Fragment>
  );
};

export default TagsManagement;
