import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CardMedia from "@mui/material/CardMedia";
import dynamic from "next/dynamic";
import { getQuestionApi } from "../../api/question";
import {
  addAnswerApi,
  listAnswerApi,
  getAnswerApi,
  ListAnswerRes,
  updateAnswerApi,
} from "../../api/answer";
import NavBar from "../../components/Navbar";
import Footer from "../../components/editor/Footer";
import { serialize, toSlateJson } from "../../utils/format";
import { unEscape } from "../../utils/html";

const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const [answerList, setAnswerList] = useState<ListAnswerRes[]>([]);
  const [slateJson, setSlateJson] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const Editor = dynamic(() => import("../../components/editor/Editor"), { ssr: false });

  useEffect(() => {
    if (id) {
      getQuestionApi({ id: id as string }).then((res) => {
        const { title, description } = res.data;
        setTitle(title);
        setDescription(description);
      });
      listAnswerApi({ questionId: id as string, offset: 0, count: 20 }).then((res) => {
        if (Array.isArray(res.data)) {
          setAnswerList(res.data);
        }
      });
    }
  }, [router.asPath, id]);

  const showQuestionEditor = () => {
    setShowEditor(true);
  };

  const handleSuccess = (res: any) => {
    const { answerId } = res.data;
    getAnswerApi({ id: answerId }).then((answerResp) => {
      if (answerResp?.data) {
        if (isUpdate) {
          const newAnswerList = answerList.map((item) => {
            if (item.answerId === answerId) {
              item.content = answerResp?.data.content;
            }
            return item;
          });
          setAnswerList(newAnswerList);
        } else {
          const newItem = {
            answerId,
            content: answerResp?.data.content,
            authorId: answerResp?.data.authorId,
          };
          const newAnswerList = [newItem, ...answerList];
          setAnswerList(newAnswerList);
        }
      }
    });
    setShowSuccessMsg(true);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      setShowSuccessMsg(false);
      setShowEditor(false);
      localStorage.removeItem("content");
      if (isUpdate) {
        setSlateJson(null);
        setIsUpdate(false);
        localStorage.removeItem("content");
        setCurrentAnswer("");
      }
    }, 2000);
  };

  const submitAnswer = () => {
    const value: any = localStorage.getItem("content");
    if (!value) {
      handleFail("No content change detected!");
      return;
    }
    const serializedVal = serialize({ children: JSON.parse(value) });
    console.log("submit", serializedVal);
    if (isUpdate) {
      updateAnswerApi({ answerId: currentAnswer, content: serializedVal })
        .then((res) => {
          handleSuccess(res);
        })
        .catch((err) => {
          handleFail(err.response.data.msg);
        });
    } else {
      addAnswerApi({ questionId: id as string, content: serializedVal })
        .then((res) => {
          handleSuccess(res);
        })
        .catch((err) => {
          handleFail(err.response.data.msg);
        });
    }
  };

  const handleFail = (msg: string) => {
    setFailMsg(msg);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      setFailMsg("");
    }, 2000);
  };

  const handleCancel = () => {
    if (isUpdate) {
      setSlateJson(null);
      setIsUpdate(false);
      localStorage.removeItem("content");
      setCurrentAnswer("");
    }
    setShowEditor(false);
  };

  const renderEditor = () => {
    return (
      <div className="relative flex justify-center">
        <Editor slateJson={slateJson as any} />
        <Footer onSubmit={submitAnswer} cancel={handleCancel} />
        {showSuccessMsg ? (
          <Alert variant="filled" severity="success" className="fixed top-96">
            {isUpdate ? "Update" : "Add"} answer successfully!
          </Alert>
        ) : null}
        {failMsg ? (
          <Alert variant="filled" severity="error" className="fixed bottom-24 right-4">
            {failMsg}
          </Alert>
        ) : null}
      </div>
    );
  };

  const toAnswerDetail = (answerId: string) => {
    router.push({
      pathname: "/answer/[id]",
      query: { id: answerId, questionId: id },
    });
  };

  const editAnswer = (event: MouseEvent, answerId: string) => {
    event.stopPropagation();
    initAnswerContent(answerId);
    setCurrentAnswer(answerId);
  };

  const initAnswerContent = (answerId: string) => {
    getAnswerApi({ id: answerId }).then((answerResp) => {
      if (answerResp?.data) {
        const { content } = answerResp?.data;
        const unEscapedContent = unEscape(content);
        setSlateJson(toSlateJson(unEscapedContent));
        setShowEditor(true);
        setIsUpdate(true);
      }
    });
  };

  const renderList = () => {
    let userId: string = "";
    if (typeof window !== "undefined") {
      userId = localStorage?.getItem("quizme_userId") || "";
    }
    return (
      <div className="flex flex-wrap py-6 justify-evenly">
        {answerList.map((item) => {
          return (
            <Card
              sx={{ width: 320 }}
              key={item.answerId}
              className="mb-8 hover:cursor-pointer"
              onClick={() => toAnswerDetail(item.answerId as string)}
            >
              <div className="flex justify-center">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  style={{ width: "50px" }}
                  image="/pen.jpeg"
                />
              </div>
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={"span"}
                  style={{ height: "10vh", overflow: "hidden" }}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: unEscape(item.content.slice(0, 300)) }}
                  ></span>
                </Typography>
              </CardContent>
              {userId === item.authorId ? (
                <CardActions>
                  <IconButton
                    color="primary"
                    aria-label="edit answer"
                    onClick={(event: any) => editAnswer(event, item.answerId as string)}
                  >
                    <EditIcon />
                  </IconButton>
                </CardActions>
              ) : null}
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <NavBar shouldHideBtn={true} />
      <Card
        sx={{
          boxShadow: 1,
          borderRadius: 0,
          p: 2,
          minWidth: 300,
          paddingLeft: 45,
          paddingRight: 45,
          paddingBottom: 5,
        }}
        className="shadow-md"
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {unEscape(description)}
          </Typography>
        </CardContent>
        <CardActions style={{ position: "relative" }}>
          <Button
            size="small"
            variant="contained"
            style={{ position: "absolute", left: "16px", backgroundColor: "#1976d2" }}
            onClick={showQuestionEditor}
          >
            Add Answer
          </Button>
        </CardActions>
      </Card>
      <div style={{ backgroundColor: showEditor ? "#eee" : "rgba(18,18,18,0)", height: "83vh" }}>
        <Container fixed>{showEditor ? renderEditor() : renderList()}</Container>
      </div>
    </div>
  );
};

export default QuestionPage;
