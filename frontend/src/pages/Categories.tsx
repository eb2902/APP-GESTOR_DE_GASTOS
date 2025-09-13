import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Palette,
} from '@mui/icons-material';
import { categoriesService } from '../services/api';
import type { Category, CreateCategoryRequest } from '../services/api';

const Categories: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    color: '#1976d2',
  });

  const predefinedColors = [
    '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
    '#d32f2f', '#0288d1', '#689f38', '#fbc02d',
    '#e64a19', '#5d4037', '#455a64', '#c2185b',
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch {
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        color: category.color,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        color: '#1976d2',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, formData);
      } else {
        await categoriesService.create(formData);
      }
      handleCloseDialog();
      fetchCategories();
    } catch {
      setError('Error al guardar la categoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await categoriesService.delete(id);
        fetchCategories();
      } catch {
        setError('Error al eliminar la categoría');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        spacing={2}
        mb={3}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={!isSmallMobile && <Add />}
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
          sx={{ 
            minWidth: { xs: 'auto', sm: 'fit-content' },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {isSmallMobile ? <Add /> : 'Nueva Categoría'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {error}
        </Alert>
      )}

      {categories.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography 
              variant="h6" 
              color="textSecondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              No hay categorías registradas
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ 
                mt: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Crea tu primera categoría para organizar tus gastos
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: { xs: 2, sm: 3 }
          }}
        >
          {categories.map((category) => (
            <Card key={category.id} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }} 
                  justifyContent="space-between" 
                  spacing={1}
                  mb={2}
                >
                  <Chip
                    label={category.name}
                    style={{ 
                      backgroundColor: category.color, 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: isSmallMobile ? '0.75rem' : '0.8125rem'
                    }}
                    sx={{ 
                      maxWidth: { xs: '100%', sm: 'calc(100% - 80px)' },
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                  <Box display="flex" gap={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(category)}
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <Edit fontSize={isSmallMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(category.id)}
                      sx={{ p: { xs: 0.5, sm: 1 } }}
                    >
                      <Delete fontSize={isSmallMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </Box>
                </Stack>
                
                {category.description && (
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 2,
                      wordBreak: 'break-word'
                    }}
                  >
                    {category.description}
                  </Typography>
                )}
                
                <Box display="flex" alignItems="center">
                  <Palette 
                    sx={{ 
                      mr: 1, 
                      color: category.color,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}
                  >
                    {category.color}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Dialog para crear/editar categoría */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isSmallMobile}
        PaperProps={{
          sx: {
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          pb: { xs: 1, sm: 2 }
        }}>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', sm: '1rem' }
              }
            }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            variant="outlined"
            multiline
            rows={isSmallMobile ? 2 : 3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', sm: '1rem' }
              }
            }}
          />
          
          <Typography 
            variant="subtitle2" 
            gutterBottom
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Color
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={{ xs: 0.5, sm: 1 }} 
            mb={2}
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
          >
            {predefinedColors.map((color) => (
              <Box
                key={color}
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  backgroundColor: color,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: formData.color === color ? '3px solid #000' : '2px solid #ccc',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s ease-in-out',
                }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </Box>
          
          <TextField
            margin="dense"
            label="Color personalizado"
            type="color"
            fullWidth
            variant="outlined"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: { xs: '1rem', sm: '1rem' },
                height: { xs: '40px', sm: '56px' }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          px: { xs: 2, sm: 3 }, 
          pb: { xs: 2, sm: 3 },
          gap: { xs: 1, sm: 0 }
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;
