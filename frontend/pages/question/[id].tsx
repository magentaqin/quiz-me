import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { getQuestionApi } from "../../api/question";
import NavBar from "../../components/Navbar";
import styles from "../styles/QuestionDetail.module.scss";

const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      getQuestionApi({ id: id as string }).then((res) => {
        const { title, description } = res.data;
        setTitle(title);
        setDescription(description);
      });
    }
  }, [router.asPath, id]);

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
          <Button size="small" variant="contained" style={{ position: "absolute", left: "16px" }}>
            Add Answer
          </Button>
        </CardActions>
      </Card>
      <Container fixed>
        <h1>empty</h1>
      </Container>
    </div>
  );
};

export default QuestionPage;
