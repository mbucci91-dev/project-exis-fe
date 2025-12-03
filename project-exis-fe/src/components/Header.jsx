import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 3 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 0,
              fontWeight: 700,
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => navigate('/')}
          >
            💳 CardManager
          </Typography>

          {/* Navigazione - Visibile solo se autenticato */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/home')}
                sx={{
                  fontWeight: location.pathname === '/home' ? 700 : 400,
                  borderBottom: location.pathname === '/home' ? '2px solid white' : 'none',
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate('/profilo')}
                sx={{
                  fontWeight: location.pathname === '/profilo' ? 700 : 400,
                  borderBottom: location.pathname === '/profilo' ? '2px solid white' : 'none',
                }}
              >
                Profilo
              </Button>
            </Box>
          )}

          {/* User info e Logout */}
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.username || 'Utente'}
              </Typography>
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
