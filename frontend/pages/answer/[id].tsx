import Card from "@mui/material/Card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Editor from "../../components/editor/Editor";
import Typography from "@mui/material/Typography";
import { unEscape } from "../../utils/html";

import { getQuestionApi } from "../../api/question";
import { getAnswerApi } from "../../api/answer";
import { toSlateJson } from "../../utils/format";

const AnswerPage = () => {
  const router = useRouter();
  const { id, questionId } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slateJson, setSlateJson] = useState(null);

  useEffect(() => {
    if (questionId) {
      getQuestionApi({ id: questionId as string }).then((res) => {
        const { title, description } = res.data;
        setTitle(title);
        setDescription(description);
      });
    }
    if (id) {
      getAnswerApi({ id: id as string }).then((answerResp) => {
        if (answerResp?.data) {
          const { content } = answerResp?.data;
          const unEscapedContent = unEscape(content);
          setSlateJson(toSlateJson(unEscapedContent));
        }
      });
    }
  }, [router.asPath, id, questionId]);
  return (
    <div>
      <Card
        sx={{
          boxShadow: 1,
          borderRadius: 0,
          minWidth: 300,
          paddingLeft: 35,
          paddingRight: 35,
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
      </Card>
      {slateJson ? <Editor fromAnswer={true} slateJson={slateJson} /> : null}
    </div>
  );
};

export default AnswerPage;
