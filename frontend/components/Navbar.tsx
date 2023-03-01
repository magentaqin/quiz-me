import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import styles from "../styles/Home.module.scss";
import UserForm from "./UserForm";
import QuestionForm from "./QuestionForm";
import { UserRes, getUserInfoApi } from "../api/user";

export type FormType = "signup" | "login" | "question";

interface Props {
  shouldHideBtn?: boolean;
}

const NavBar = (props: Props) => {
  const [formType, setFormType] = useState<FormType>("signup");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserRes>({ userName: "", token: "", userId: "" });

  useEffect(() => {
    getUserInfoApi().then((res) => {
      if (res?.data?.userName) {
        setUser({ userName: res?.data?.userName });
      }
    });
  }, []);

  const handleSignup = () => {
    setFormType("signup");
    setOpen(true);
  };
  const handleLogin = () => {
    setFormType("login");
    setOpen(true);
  };
  const setUserInfo = (userInfo: UserRes) => {
    setUser(userInfo);
  };
  const addQuestion = () => {
    setFormType("question");
    setOpen(true);
  };

  const renderTopRight = () => {
    if (user.userName) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          {props.shouldHideBtn ? null : (
            <Button variant="contained" size="small" onClick={addQuestion} style={{ backgroundColor: "#1976d2" }}>
              Add Question
            </Button>
          )}
          <p>{user.userName}</p>
        </Stack>
      );
    }
    return (
      <Stack direction="row" spacing={2}>
        <Button variant="text" size="small" onClick={handleSignup}>
          Sign Up
        </Button>
        <Button variant="contained" size="small" onClick={handleLogin} style={{ backgroundColor: "#1976d2" }}>
          Login
        </Button>
      </Stack>
    );
  };

  const renderForm = () => {
    if (formType === "question") {
      return <QuestionForm open={open} setOpen={setOpen} />;
    }
    return <UserForm open={open} setOpen={setOpen} formType={formType} setUserInfo={setUserInfo} />;
  };

  return (
    <Fragment>
      <div className={styles.navbar}>
        <Image src="/logo.png" height={50} width={200} alt="logo" />
        {renderTopRight()}
      </div>
      {renderForm()}
    </Fragment>
  );
};

export default NavBar;
