import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  Snackbar,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { getTaskByUser, deleteTask, updateTaskStatus } from '../services/taskService';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const UserTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentUserId = Number(localStorage.getItem('userId'));
        setUserId(currentUserId);
        const tasksData = await getTaskByUser(currentUserId);
        setTasks(tasksData);
      } catch (error) {
        console.error('Erro ao buscar tarefas do usuário:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
      setTasks((prevTasks) => prevTasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const paginatedTasks = tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ width: '100%', padding: 0, paddingLeft: '0 !important', paddingRight: '0 !important', margin: 0 }}
    >
      <Header
        userName={localStorage.getItem('name')}
        userPhoto={localStorage.getItem('userPhoto') ? `data:image/png;base64,${localStorage.getItem('userPhoto')}` : null}
        userId={userId}
        setUserPhoto={(photo) => localStorage.setItem('userPhoto', photo ? photo.split(',')[1] : '')}
      />
      <Container>
        <Typography variant="h4" sx={{ paddingY: 2 }}>Minhas Tarefas</Typography>
        {tasks.length === 0 ? (
          <Typography variant="body1" sx={{ paddingY: 2 }}>Nenhuma tarefa encontrada.</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome da Tarefa</TableCell>
                    <TableCell>Projeto</TableCell> {/* Nova coluna para o nome do projeto */}
                    <TableCell>Data de Entrega</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleProjectClick(task.projectId)}>
                          {task.project.name}
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(task.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {task.status === 'completed' ? 'Finalizado ' : 'Pendente '}
                        <span
                          style={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: task.status === 'completed' ? 'green' : 'yellow',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Marcar como concluída">
                          <IconButton color="success" onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deletar">
                          <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        <Button variant="contained" sx={{ marginY: 1 }} onClick={() => window.history.back()}>Voltar</Button>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UserTasks;
