import type { NextPage } from "next";
import { Fragment, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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

  const renderFrontTags = () => {
    return frontendList.map((item) => {
      return (
        <div key={item}>
          <FormControlLabel control={<Checkbox defaultChecked />} label={item} />
          <TextField id="tag-description" label="Description" variant="standard" />
        </div>
      );
    });
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
          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
          </FormGroup>
        </div>
      </div>
    </Fragment>
  );
};

export default TagsManagement;
