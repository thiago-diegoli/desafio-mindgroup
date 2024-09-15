import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { getAllProjects } from '../services/projectService';
import Avatar from '@mui/material/Avatar';
import { blue, red } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';

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

const CardMediaCustom = styled(CardMedia)({
  paddingTop: '56.25%',
});

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [showMyProjects, setShowMyProjects] = useState(false);
  const projectsPerPage = 3;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('teste');
    localStorage.removeItem('userPhoto');
    navigate('/signin');
  };
  const userName = localStorage.getItem('name');
  const userPhoto = localStorage.getItem('userPhoto');

  const userInitial = userName ? userName.charAt(0).toUpperCase() : '';

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <DashboardIcon sx={{ marginRight: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: '4px'
            }}
          >
          <Avatar
            src={userPhoto || undefined}
            sx={{
              bgcolor: userPhoto ? undefined : blue[400],
              marginRight: 2,
            }}
          >
            {!userPhoto && userInitial}
          </Avatar>
          <Typography variant="h6" color="white">
            {userName || 'Usuário Desconhecido'}
          </Typography>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>Trocar foto</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
            <LogoutIcon sx={{marginRight: 1}}/>
            Sair
          </MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>
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
                  <Button variant="contained" color="primary">
                    Adicionar Projeto
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Ver Tarefas
                  </Button>
                </Grid>
              </Grid>
            </HeroButtons>
          </Container>
        </HeroContent>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="body1" sx={{ marginRight: 1 }}>
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
                    <CardMediaCustom
                      image="https://source.unsplash.com/random"
                      title={project.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.name}
                      </Typography>
                      <Typography>
                        {project.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        Ver
                      </Button>
                      <Button size="small" color="primary">
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              {pageNumbers.map(number => (
                <Button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  variant={currentPage === number ? 'contained' : 'outlined'}
                  color="primary"
                  sx={{ margin: 1 }}
                >
                  {number}
                </Button>
              ))}
            </Box>
          </CardGrid>
        </Container>
      </main>
    </React.Fragment>
  );
}
