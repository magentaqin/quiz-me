import Card from "@mui/material/Card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Editor from "../../components/editor/Editor";
import Typography from "@mui/material/Typography";
import { unEscape } from "../../utils/html";
import { getAnswerServerApi, getQuestionServerApi } from '../../api/serverSide'
import { getAnswerApi } from "../../api/answer";
import { toSlateJson } from "../../utils/format";

interface ServerData {
  title: string;
  description: string;
  content: string;
}

const AnswerPage = ({ data }: { data: ServerData }) => {
  const router = useRouter();
  const { title, description } = data;
  const { id } = router.query;
  const [slateJson, setSlateJson] = useState(null);

  useEffect(() => {
    if (data.content) {
      setSlateJson(toSlateJson(data.content));
    } else if (id) {
      getAnswerApi({ id: id as string }).then((answerResp) => {
        if (answerResp?.data) {
          const { content } = answerResp?.data;
          const unEscapedContent = unEscape(content);
          setSlateJson(toSlateJson(unEscapedContent));
        }
      });
    }
  }, [router.asPath, id, data]);

  // in SSR mode only render html string without editor
  // in CSR mode, render editor into view
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
      {slateJson ? (
        <Editor fromAnswer={true} slateJson={slateJson} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { id, questionId } = context.query;
  if (questionId) {
    let title = "",
      description = "",
      content = null;
    const promises = [getQuestionServerApi({ id: questionId }), getAnswerServerApi({ id })];
    const [questionResp, answerResp] = await Promise.all(promises);
    const questionData = await questionResp.json()
    const answerData = await answerResp.json()
    if (questionData) {
      title = questionData.title;
      description = questionData.description;
    }
    if (answerData) {
      content = unEscape(answerData.content);
    }
    const data = {
      title,
      description,
      content
    };
    return {
      props: {
        data,
      },
    };
  }
}

export default AnswerPage;
