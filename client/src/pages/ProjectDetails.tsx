import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { getProjectById } from '../services/projectService';
import Header from '../components/Header';
const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [userId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProjectById(Number(id)!);
        setProject(projectData);
      } catch (error) {
        console.error('Erro ao buscar o projeto:', error);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return <Typography variant="h6">Carregando projeto...</Typography>;
  }

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
      <Card>
        <CardContent>
          <Typography variant="h4">{project.name}</Typography>
          <Typography variant="body1">{project.description}</Typography>
        </CardContent>
      </Card>
      <Button onClick={() => window.history.back()}>Voltar</Button>
    </Container>
  );
};

export default ProjectDetails;
