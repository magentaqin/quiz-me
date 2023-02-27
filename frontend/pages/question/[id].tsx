import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import dynamic from "next/dynamic";
import { getQuestionApi } from "../../api/question";
import { addAnswerApi, listAnswerApi, getAnswerApi } from "../../api/answer";
import NavBar from "../../components/Navbar";
import Footer from "../../components/editor/Footer";
import { serialize } from "../../utils/format";
import { unEscape } from "../../utils/html";

const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [failMsg, setFailMsg] = useState("");
  const [answerList, setAnswerList] = useState([])
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const Editor = dynamic(() => import("../../components/editor/Editor"), { ssr: false });

  useEffect(() => {
    if (id) {
      getQuestionApi({ id: id as string }).then((res) => {
        const { title, description } = res.data;
        setTitle(title);
        setDescription(description);
      });
      listAnswerApi({ questionId: id as string, offset: 0, count: 20}).then((res) => {
        console.log('res∂', res.data)
        if (Array.isArray(res.data)) {
          setAnswerList(res.data)
        }
      })
    }
  }, [router.asPath, id]);

  const showQuestionEditor = () => {
    setShowEditor(true);
  };

  const handleSuccess = () => {
    setShowSuccessMsg(true);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      setShowSuccessMsg(false);
      setShowEditor(false);
    }, 2000);
  };

  const submitAnswer = () => {
    const value: any = localStorage.getItem("content");
    if (value) {
      const serializedVal = serialize({ children: JSON.parse(value) });
      console.log("submit", serializedVal);
      addAnswerApi({ questionId: id as string, content: serializedVal })
        .then((res) => {
          getAnswerApi({}).then(() => {

          })
          handleSuccess();
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

  const renderEditor = () => {
    return (
      <div className="flex justify-center relative">
        <Editor />
        <Footer onSubmit={submitAnswer} />
        {showSuccessMsg ? (
          <Alert variant="filled" severity="success" className="fixed top-96">
            Add question successfully!
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

  const renderList = () => {
    return (
      <div className="py-6 flex flex-wrap justify-evenly">
        {
          answerList.map(item => {
            return (
              <Card sx={{ maxWidth: 320 }} key={item.answerId} className="mb-8">
          <CardActionArea className="py-3" >
            <div className="flex justify-center">
              <CardMedia
                component="img"
                alt="green iguana"
                style={{ width: "50px" }}
                image="/pen.jpeg"
              />
            </div>
            <CardContent style={{ height: '10vh', overflow: 'hidden'}}>
              <Typography variant="body2" color="text.secondary" component={'span'}>
                <span dangerouslySetInnerHTML={{__html: unEscape(item.content.slice(0, 300))}}></span>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
            )
          })
        }
      </div>
    );
  };

  return (
    <div>
      <NavBar shouldHideBtn={true} />
      <Card
        sx={{
          boxShadow: 0,
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
            {description}
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
      <div style={{ backgroundColor: showEditor ? "#eee" : "rgba(18,18,18,0)", height: "100vh" }}>
        <Container fixed>{showEditor ? renderEditor() : renderList()}</Container>
      </div>
    </div>
  );
};

export default QuestionPage;
