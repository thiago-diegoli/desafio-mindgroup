// src/components/Header.tsx
import React, { useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { updateUserPhoto } from '../services/userService';
import { blue } from '@mui/material/colors';
import { Box, Button } from '@mui/material';

interface HeaderProps {
  userName: string | null;
  userPhoto: string | null;
  userId: number | null;
  setUserPhoto: (photo: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userPhoto, userId, setUserPhoto }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userInitial = userName ? userName.charAt(0).toUpperCase() : '';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('name');
    navigate('/signin');
  };

  const handleChangePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          if (userId !== null) {
            try {
              await updateUserPhoto(userId.toString(), base64String);
              alert('Foto atualizada');
              window.location.reload();
              localStorage.setItem('userPhoto', base64String);
              const imageUrl = `data:image/png;base64,${base64String}`;
              setUserPhoto(imageUrl);
            } catch (error) {
              console.error('Erro ao atualizar a foto:', error);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <AppBar position="relative" sx={{ mb: 4 }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
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
              borderRadius: '4px',
            }}
          >
            <Avatar
              src={userPhoto || undefined}
              sx={{
                bgcolor: userPhoto ? undefined : blue[400],
                mr: 2,
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
            <MenuItem onClick={triggerFileSelect}>
              Trocar foto
            </MenuItem>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleChangePhoto}
            />
            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
