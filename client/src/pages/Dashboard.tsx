import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { createProject, getAllProjects } from '../services/projectService';
import { getUserById } from '../services/userService';
import Header from '../components/Header';

const HeroContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(8, 0, 6),
}));

const HeroButtons = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const CardGrid = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const Dashboard: React.FC = () => {
  interface Project {
    id: number;
    name: string;
    description: string;
    userId: number;
  }

  interface User {
    id: number;
    name: string;
    email: string;
    photo: string | null;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [projectsPerPage] = useState(3);
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData: Project[] = await getAllProjects();
        setProjects(projectsData);

        const userIds = Array.from(new Set(projectsData.map(project => project.userId)));

        const usersData = await Promise.all(userIds.map(id => getUserById(id)));

        const usersById = usersData.reduce((acc: Record<number, User>, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        setUsers(usersById);
      } catch (error) {
        console.error('Erro ao buscar projetos e usuários:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const filteredProjects = showMyProjects ? projects.filter((project) => project.userId === userId) : projects;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProjects.length / projectsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowMyProjects(event.target.checked);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCreateProject = async () => {
    if (projectName && projectDescription && userId) {
      try {
        const newProject = await createProject({
          name: projectName,
          description: projectDescription,
        });
        const data = await getAllProjects();
        setProjects(data);
        handleCloseModal();
        setProjectName('');
        setProjectDescription('');
        navigate(`/project/${newProject.id}`);
      } catch (error) {
        console.error('Failed to create project', error);
      }
    }
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Header
        userName={localStorage.getItem('name')}
        userPhoto={localStorage.getItem('userPhoto') ? `data:image/png;base64,${localStorage.getItem('userPhoto')}` : null}
        userId={userId}
        setUserPhoto={(photo) => localStorage.setItem('userPhoto', photo ? photo.split(',')[1] : '')}
      />
      <main>
        <HeroContent>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Aqui você pode visualizar seus projetos e gerenciar suas tarefas.
            </Typography>
            <HeroButtons>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Adicionar Projeto
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleViewTasks}>
                    Ver Tarefas
                  </Button>
                </Grid>
              </Grid>
            </HeroButtons>
          </Container>
        </HeroContent>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Filtrar meus projetos
            </Typography>
            <input
              type="checkbox"
              checked={showMyProjects}
              onChange={handleCheckboxChange}
            />
          </Box>
          <CardGrid>
            <Grid container spacing={4}>
              {currentProjects.map((project) => (
                <Grid item key={project.id} xs={12} sm={6} md={4}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.name}
                      </Typography>
                      <Typography>
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        {users[project.userId] ? (
                          <>
                            <Avatar
                              src={users[project.userId]?.photo ? `data:image/png;base64,${users[project.userId].photo}` : undefined}
                              sx={{ bgcolor: users[project.userId]?.photo ? undefined : blue[400], mr: 2 }}
                            >
                              {!users[project.userId]?.photo && users[project.userId]?.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body1">
                              {users[project.userId]?.name}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body1">Carregando usuário...</Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary" onClick={() => handleViewProject(project.id)}>
                        Ver
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {pageNumbers.map(number => (
                <Button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  variant={currentPage === number ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ m: 1 }}
                >
                  {number}
                </Button>
              ))}
            </Box>
          </CardGrid>
        </Container>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Projeto"
              type="text"
              fullWidth
              variant="outlined"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Descrição"
              type="text"
              fullWidth
              variant="outlined"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button onClick={handleCreateProject}>Cadastrar</Button>
          </DialogActions>
        </Dialog>
      </main>
    </React.Fragment>
  );
};

export default Dashboard;
