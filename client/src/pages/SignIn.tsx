import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '90vh',
}));

const PaperContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

export default function SignIn() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <CenteredBox>
        <PaperContainer>
          <Avatar sx={{ mb: 1, bgcolor: 'primary.main' }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Fazer login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Logar
            </SubmitButton>
            <Grid container>
              <Grid item xs />
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Não possui uma conta? Cadastre-se"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </PaperContainer>
      </CenteredBox>
    </Container>
  );
}
