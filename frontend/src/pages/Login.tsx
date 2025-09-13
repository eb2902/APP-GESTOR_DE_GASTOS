import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // La navegación se manejará automáticamente por el cambio de estado en el contexto
      // navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response &&
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs"
      sx={{ 
        px: { xs: 2, sm: 3 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={isMobile ? 0 : 3} 
          sx={{ 
            padding: { xs: 3, sm: 4 }, 
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.paper' },
            boxShadow: { xs: 'none', sm: 3 }
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              fontWeight: 600,
              mb: { xs: 2, sm: 3 }
            }}
          >
            Gestor de Gastos
          </Typography>
          <Typography 
            component="h2" 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              mb: { xs: 2, sm: 3 }
            }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus={!isMobile}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: { xs: 1.5, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1rem' },
                minHeight: { xs: 48, sm: 42 }
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <Box textAlign="center">
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
              >
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
