import { useState, Fragment, useEffect } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import UserForm from "./UserForm";
import QuestionForm, { QuestionHandleType } from "./QuestionForm";
import { UserRes, getUserInfoApi, Role } from "../api/user";

export type FormType = "signup" | "login" | "question";

const NavBar = () => {
  const [formType, setFormType] = useState<FormType>("signup");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserRes>({ userName: "", role: Role.USER });

  useEffect(() => {
    getUserInfoApi().then((res: { data: UserRes }) => {
      if (res?.data) {
        setUser(res.data);
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

  const toTagsManagement = () => {
    router.push({
      pathname: "/tags-management",
    });
  };

  const renderTopRight = () => {
    if (user.userName) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          {user.role === (Role.ADMIN || Role.USER) ? (
            <Button
              variant="contained"
              size="small"
              onClick={addQuestion}
              style={{ backgroundColor: "#1976d2" }}
            >
              Add Question
            </Button>
          ) : null}
          {user.role === Role.ADMIN ? (
            <Button
              variant="contained"
              size="small"
              onClick={toTagsManagement}
              style={{ backgroundColor: "#1976d2" }}
            >
              Manage Tags
            </Button>
          ) : null}
          <p>{user.userName}</p>
        </Stack>
      );
    }
    return (
      <Stack direction="row" spacing={2}>
        <Button variant="text" size="small" onClick={handleSignup}>
          Sign Up
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleLogin}
          style={{ backgroundColor: "#1976d2" }}
        >
          Login
        </Button>
      </Stack>
    );
  };

  const renderForm = () => {
    if (formType === "question") {
      return <QuestionForm open={open} setOpen={setOpen} type={QuestionHandleType.ADD} />;
    }
    return <UserForm open={open} setOpen={setOpen} formType={formType} setUserInfo={setUserInfo} />;
  };

  const toHome = () => {
    router.push({
      pathname: "/",
    });
  };

  return (
    <Fragment>
      <div className={styles.navbar}>
        <Image
          src="/logo.png"
          height={50}
          width={200}
          alt="logo"
          onClick={toHome}
          className="cursor-pointer"
        />
        {renderTopRight()}
      </div>
      {renderForm()}
    </Fragment>
  );
};

export default NavBar;
