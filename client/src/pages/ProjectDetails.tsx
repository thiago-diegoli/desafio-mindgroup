import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageIcon from '@mui/icons-material/Message';
import CheckIcon from '@mui/icons-material/Check';
import { deleteProject, getProjectById } from '../services/projectService';
import { createTask, getTaskByProject, deleteTask, updateTaskStatus } from '../services/taskService';
import { getAllUsers } from '../services/userService';
import Header from '../components/Header';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<number | string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProjectById(Number(id)!);
        setProject(projectData);
        setUserId(Number(localStorage.getItem('userId')));
      } catch (error) {
        console.error('Erro ao buscar o projeto:', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const tasksData = await getTaskByProject(Number(id)!);
        setTasks(tasksData);
      } catch (error) {
        console.error('Erro ao buscar tarefas do projeto:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchProject();
    fetchTasks();
    fetchUsers();
  }, [id]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleOpenDescriptionModal = (task: any) => {
    setSelectedTask(task);
    setOpenDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => setOpenDescriptionModal(false);

  const handleAddTask = async () => {
    try {
      const newTask = await createTask({
        name: taskName,
        description: taskDescription,
        deliveryDate: dueDate,
        projectId: Number(id),
        responsibleId: Number(assignedUserId),
      });

      setTasks((prevTasks) => [...prevTasks, newTask]);

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (userId === project.userId) {
      try {
        await deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    } else {
      setSnackbarMessage('Você não pode deletar esta tarefa.');
      setSnackbarOpen(true);
    }
  };
  
  const handleDeleteProject = async () => {
    if (userId === project.userId) {
      try {
        await deleteProject(Number(id));
        window.history.back();
      } catch (error) {
        console.error('Erro ao deletar projeto:', error);
      }
    } else {
      setSnackbarMessage('Você não pode deletar este projeto.');
      setSnackbarOpen(true);
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

  if (!project) {
    return <Typography variant="h6">Carregando projeto...</Typography>;
  }

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
        <Typography variant="h3" sx={{ paddingY: 4 }}>{project.name}</Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>Descrição do projeto:<br></br></Typography>
        <Typography variant="body1" sx={{ paddingY: 2 }}>{project.description}</Typography>
        <Typography variant="h4" sx={{ paddingY: 2 }}>Tarefas</Typography>
        {userId === project.userId && (
          <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
            <Fab
              color="primary"
              aria-label="add"
              sx={{ marginRight: 2 }}
              onClick={handleOpenModal}
            >
              <AddIcon />
            </Fab>
            <Fab
              color="error"
              aria-label="delete"
              onClick={handleDeleteProject}
            >
              <DeleteIcon />
            </Fab>
          </div>
        )}

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Tarefa"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Data de Entrega"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="assigned-user-label">Encarregado</InputLabel>
              <Select
                labelId="assigned-user-label"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                label="Encarregado"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleAddTask} color="primary">Adicionar</Button>
          </DialogActions>
        </Dialog>

        {selectedTask && (
          <Dialog open={openDescriptionModal} onClose={handleCloseDescriptionModal}>
            <DialogTitle>Descrição da Tarefa</DialogTitle>
            <DialogContent>
              <Typography variant="body1">{selectedTask.description}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDescriptionModal}>Fechar</Button>
            </DialogActions>
          </Dialog>
        )}

        {tasks.length === 0 ? (
          <Typography variant="body1" sx={{ paddingY: 2 }}>
            Nenhuma tarefa adicionada
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Data de Entrega</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Encarregado</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>
                        <Tooltip title="Ver descrição">
                          <IconButton onClick={() => handleOpenDescriptionModal(task)}>
                            <MessageIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{new Date(task.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                      { task.status === 'completed' ? ' Finalizado ' : ' Pendente ' }
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
                      <TableCell>{task.responsible?.name}</TableCell>
                      <TableCell>
                        {userId === project.userId && (
                          <>
                            <Tooltip title="Deletar">
                              <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Marcar como concluída">
                              <IconButton color="success" onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
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

export default ProjectDetails;
