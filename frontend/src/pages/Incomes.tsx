import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Snackbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { incomesService, categoriesService } from '../services/api';
import type { Income, Category, CreateIncomeRequest } from '../services/api';

const Incomes: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [incomeToDeleteId, setIncomeToDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [formData, setFormData] = useState<CreateIncomeRequest>({
    title: '',
    description: '',
    amount: 0,
    date: dayjs().format('YYYY-MM-DD'),
    categoryId: undefined,
  });

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const data = await incomesService.getAll();
      setIncomes(data);
    } catch {
      setError('Error al cargar los ingresos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleOpenDialog = (income?: Income) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        title: income.title,
        description: income.description || '',
        amount: Number(income.amount),
        date: income.date,
        categoryId: income.categoryId,
      });
    } else {
      setEditingIncome(null);
      setFormData({
        title: '',
        description: '',
        amount: 0,
        date: dayjs().format('YYYY-MM-DD'),
        categoryId: undefined,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIncome(null);
  };

  const handleOpenConfirmDialog = (id: number) => {
    setIncomeToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setIncomeToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (incomeToDeleteId) {
      try {
        await incomesService.delete(incomeToDeleteId);
        fetchIncomes();
        setSnackbarMessage('Ingreso eliminado correctamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch {
        setError('Error al eliminar el ingreso');
        setSnackbarMessage('Error al eliminar el ingreso');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingIncome) {
        await incomesService.update(editingIncome.id, formData);
        setSnackbarMessage('Ingreso actualizado correctamente');
        setSnackbarSeverity('success');
      } else {
        await incomesService.create(formData);
        setSnackbarMessage('Ingreso creado correctamente');
        setSnackbarSeverity('success');
      }
      handleCloseDialog();
      fetchIncomes();
      setSnackbarOpen(true);
    } catch {
      setError('Error al guardar el ingreso');
      setSnackbarMessage('Error al guardar el ingreso');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    handleOpenConfirmDialog(id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Mobile card component for incomes
  const IncomeCard = ({ income }: { income: Income }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box flex={1} mr={1}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {income.title}
            </Typography>
            {income.description && (
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mt: 0.5,
                  wordBreak: 'break-word'
                }}
              >
                {income.description}
              </Typography>
            )}
          </Box>
          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 600,
              minWidth: 'fit-content'
            }}
          >
            {formatCurrency(Number(income.amount))}
          </Typography>
        </Box>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {income.category && (
              <Chip
                label={income.category.name}
                size="small"
                style={{ 
                  backgroundColor: income.category.color, 
                  color: 'white',
                  fontSize: isSmallMobile ? '0.6875rem' : '0.75rem'
                }}
              />
            )}
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {formatDate(income.date)}
            </Typography>
          </Box>
          
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(income)}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Edit fontSize={isSmallMobile ? 'small' : 'medium'} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(income.id)}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Delete fontSize={isSmallMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
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
              Ingresos
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
              {isSmallMobile ? <Add /> : 'Nuevo Ingreso'}
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {error}
            </Alert>
          )}

          {/* Mobile view */}
          {isMobile ? (
            <Box>
              {incomes.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      No hay ingresos registrados
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                incomes.map((income) => (
                  <IncomeCard key={income.id} income={income} />
                ))
              )}
            </Box>
          ) : (
            /* Desktop table view */
            <Card>
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Título</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell align="right">Monto</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {incomes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No hay ingresos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        incomes.map((income) => (
                          <TableRow key={income.id}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2">
                                  {income.title}
                                </Typography>
                                {income.description && (
                                  <Typography variant="body2" color="textSecondary">
                                    {income.description}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {income.category && (
                                <Chip
                                  label={income.category.name}
                                  size="small"
                                  style={{ backgroundColor: income.category.color, color: 'white' }}
                                />
                              )}
                            </TableCell>
                            <TableCell>{formatDate(income.date)}</TableCell>
                            <TableCell align="right">
                              <Typography variant="h6" color="primary">
                                {formatCurrency(Number(income.amount))}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(income)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(income.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {/* Dialog para crear/editar ingreso */}
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
              {editingIncome ? 'Editar Ingreso' : 'Nuevo Ingreso'}
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
              <TextField
                autoFocus
                margin="dense"
                label="Título"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <TextField
                margin="dense"
                label="Monto"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.amount === 0 && editingIncome === null ? '' : formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or valid numbers
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setFormData({ ...formData, amount: value === '' ? 0 : Number(value) });
                  }
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              />
              <DatePicker
                label="Fecha"
                value={dayjs(formData.date)}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, date: newValue.format('YYYY-MM-DD') });
                  }
                }}
                sx={{ 
                  mb: 2, 
                  width: '100%',
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              />
              <TextField
                select
                margin="dense"
                label="Categoría"
                fullWidth
                variant="outlined"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) || undefined })}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              >
                <MenuItem value="">Sin categoría</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
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
                {editingIncome ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialogo de confirmación de eliminación */}
          <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirmar Eliminación"}
            </DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que quieres eliminar este ingreso? Esta acción no se puede deshacer.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
      </React.Fragment>
    </LocalizationProvider>
  );
};

export default Incomes;
