import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { addQuestionApi, updateQuestionApi, getQuestionApi } from "../api/question";
import { listTagsApi, TagItem } from "../api/tag";
import TagSelect from "./TagSelect";
import LevelSelect from "./LevelSelect";

export enum QuestionHandleType {
  ADD = "ADD",
  UPDATE = "UPDATE",
}

export interface QuestionData {
  title: string;
  level: string;
  tags: TagItem[];
  description: string;
}

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  type: QuestionHandleType;
  questionId?: string;
}

export default function QuestionForm(props: Props) {
  const { open, setOpen } = props;
  const [title, setTitle] = useState("");
  const [failMsg, setFailMsg] = useState("");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagMap, setTagMap] = useState<{ [index: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    listTagsApi().then((res) => {
      if (Array.isArray(res?.data?.tags)) {
        const tagsArr = res?.data?.tags;
        setTags(tagsArr);
        const newTagMap: { [index: string]: string } = {};
        tagsArr.forEach((arrItem: TagItem) => {
          if (arrItem.name) {
            newTagMap[arrItem.name] = arrItem.tagId || '';
          }
        });
        setTagMap(newTagMap);
      }
    });
  }, []);

  useEffect(() => {
    if (props.type === QuestionHandleType.UPDATE && props.questionId) {
      getQuestionApi({ id: props.questionId }).then((res) => {
        if (res?.data) {
          const { title, description, level, tags } = res?.data;
          const selectedTags = tags.map((item: TagItem) => item.name);
          setTitle(title);
          setDescription(description);
          setLevel(level);
          setSelectedTags(selectedTags);
        }
      });
    }
  }, [props.questionId, props.type]);

  const handleSuccess = (id: string) => {
    setShowSuccessMsg(true);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      setShowSuccessMsg(false);
      setOpen(false);
      router.push({
        pathname: "/question/[id]",
        query: { id },
      });
    }, 2000);
  };

  const handleFail = (msg: string) => {
    setFailMsg(msg);
    let timer = setTimeout(() => {
      clearTimeout(timer);
      setFailMsg("");
    }, 2000);
  };

  const submit = () => {
    const tagIds = selectedTags.map((name) => {
      return tagMap[name];
    });
    const data: any = {
      title,
      description,
      tags: tagIds,
      level,
    };
    if (props.type === QuestionHandleType.ADD) {
      addQuestionApi(data)
        .then((res) => {
          handleSuccess(res.data.questionId);
        })
        .catch((err) => {
          handleFail(err.response.data.msg);
        });
    } else {
      data.questionId = props.questionId || "";
      updateQuestionApi(data)
        .then((res) => {
          handleSuccess(res.data.questionId);
        })
        .catch((err) => {
          handleFail(err.response.data.msg);
        });
    }
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {props.type === QuestionHandleType.ADD ? "Add Question" : "Update Question"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="title"
            label="Question Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={handleTitle}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={handleDescription}
          />
          <TagSelect selectedTags={selectedTags} setSelectedTags={setSelectedTags} tags={tags} />
          <LevelSelect setSelectedLevel={setLevel} level={level} />
        </DialogContent>
        <DialogActions>
          <Button onClick={submit}>
            {props.type === QuestionHandleType.ADD ? "Add Question" : "Update Question"}
          </Button>
        </DialogActions>
        {showSuccessMsg ? (
          <Alert variant="filled" severity="success">
            {props.type === QuestionHandleType.ADD
              ? "Add question successfully!"
              : "Update question successfully!"}
          </Alert>
        ) : null}
        {failMsg ? (
          <Alert variant="filled" severity="error">
            {failMsg}
          </Alert>
        ) : null}
      </Dialog>
    </div>
  );
}
