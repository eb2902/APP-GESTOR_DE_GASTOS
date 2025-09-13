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
  Stack,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      // La navegación se manejará automáticamente por el cambio de estado en el contexto
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response &&
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Error al registrarse';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
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
            Crear Cuenta
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
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 0, sm: 2 }}
              sx={{ mb: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="Nombre"
                name="firstName"
                autoComplete="given-name"
                autoFocus={!isMobile}
                value={formData.firstName}
                onChange={handleChange}
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
                id="lastName"
                label="Apellido"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
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
            </Stack>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                'Crear Cuenta'
              )}
            </Button>
            <Box textAlign="center">
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
              >
                ¿Ya tienes cuenta?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 500
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
