import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { countQuestionApi, listQuestionsApi, ListQuestionRes } from "../api/question";
import { listAnswerApi } from "../api/answer";
import { unEscape } from "../utils/html";

interface Column {
  id: "title" | "description" | "tags" | "level";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "title", label: "Question", minWidth: 250 },
  { id: "level", label: "Level", minWidth: 250 },
  { id: "tags", label: "Tags", minWidth: 250 },
  { id: "description", label: "Description", minWidth: 250 },
];

interface Props {
  keyword: string;
  tags: string[];
}

export default function QuizTable(props: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsData, setRowsData] = useState<ListQuestionRes[]>([]);
  const [count, setCount] = useState(0);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    // get the total count of questions
    const getTotalCount = () => {
      countQuestionApi({ keyword: props.keyword }).then((res) => {
        if (res.data) {
          setCount(res.data.count);
        }
      });
    };
    getTotalCount();
  }, [props.keyword]);

  useEffect(() => {
    const fetchQuestions = async (offset: number) => {
      const res = await listQuestionsApi({
        offset,
        count: rowsPerPage,
        keyword: props.keyword || undefined,
        tags: props.tags,
      });
      if (res.data) {
        const questions = res.data.questions.map((item: ListQuestionRes) => {
          return {
            ...item,
            title: unEscape(item.title),
            description: unEscape(item.description),
          };
        });
        setRowsData(questions);
      }
    };

    fetchQuestions(rowsPerPage * page);
  }, [rowsPerPage, page, props.keyword, props.tags]);

  const toQuestionDetail = (questionId: string) => {
    const enableWrite =
      typeof window === "undefined" ? false : window.localStorage.getItem("QUIZ_ME_ENABLE_WRITE");
    if (enableWrite) {
      router.push({
        pathname: "/question/[id]",
        query: { id: questionId },
      });
    } else {
      listAnswerApi({
        offset: 0,
        count: 1,
        questionId,
      }).then((res) => {
        const answerId = res?.data[0].answerId;
        router.push({
          pathname: "/answer/[id]",
          query: { id: answerId, questionId },
        });
      });
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ height: "75vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.questionId}
                  onClick={() => toQuestionDetail(row.questionId)}
                  className="cursor-pointer"
                  sx={{ maxHeight: "100px" }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (column.id === "tags" && Array.isArray(value)) {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Stack direction="row" spacing={1}>
                            {value.map((item) => {
                              return (
                                <Chip
                                  label={item.name}
                                  color="primary"
                                  variant="outlined"
                                  key={item.tagId}
                                />
                              );
                            })}
                          </Stack>
                        </TableCell>
                      );
                    }
                    if (
                      column.id === "level" &&
                      ["ENTRY", "MID", "HIGH"].includes(value as string)
                    ) {
                      const colorMap: any = {
                        ENTRY: "success",
                        MID: "primary",
                        HIGH: "error",
                      };
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={value}
                              color={colorMap[value as string]}
                              variant="filled"
                              key={value as string}
                            />
                          </Stack>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <div
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                          className="overflow-hidden text-ellipsis"
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
