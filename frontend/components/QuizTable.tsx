import { useState, ChangeEvent, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { countQuestionApi, listQuestionsApi, ListQuestionRes } from '../api/question'
import { unEscape } from '../pages/editor/utils/html';

interface Column {
  id: 'title' | 'description';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'title', label: 'Question', minWidth: 250 },
  { id: 'description', label: 'Description', minWidth: 250 },
];

interface Props {
  keyword: string;
}

export default function QuizTable(props: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsData, setRowsData] = useState<ListQuestionRes[]>([])
  const [count, setCount] = useState(0)

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
      countQuestionApi({ keyword: props.keyword}).then(res => {
        if (res.data) {
          setCount(res.data.count)
        }
      })
    }
    getTotalCount()
  }, [props.keyword]);

  useEffect(() => {
    const fetchQuestions = async (offset: number) => {
      const res = await listQuestionsApi({
        offset,
        count: rowsPerPage,
        keyword: props.keyword || undefined
      })
      if (res.data) {
        const questions = res.data.questions.map((item: ListQuestionRes) => {
          return {
            ...item,
            title: unEscape(item.title),
            description: unEscape(item.description)
          }
        })
        setRowsData(questions)
      }
    }
  
    fetchQuestions(rowsPerPage*page)
  }, [rowsPerPage, page, props.keyword])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ height: 600 }}>
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
            {rowsData
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.questionId}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
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
