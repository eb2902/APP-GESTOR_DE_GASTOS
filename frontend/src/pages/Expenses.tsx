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
import { expensesService, categoriesService } from '../services/api';
import type { Expense, Category, CreateExpenseRequest } from '../services/api';

const Expenses: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    title: '',
    description: '',
    amount: 0,
    date: dayjs().format('YYYY-MM-DD'),
    categoryId: undefined,
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expensesService.getAll();
      setExpenses(data);
    } catch {
      setError('Error al cargar los gastos');
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

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        title: expense.title,
        description: expense.description || '',
        amount: Number(expense.amount),
        date: expense.date,
        categoryId: expense.categoryId,
      });
    } else {
      setEditingExpense(null);
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
    setEditingExpense(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingExpense) {
        await expensesService.update(editingExpense.id, formData);
      } else {
        await expensesService.create(formData);
      }
      handleCloseDialog();
      fetchExpenses();
    } catch {
      setError('Error al guardar el gasto');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await expensesService.delete(id);
        fetchExpenses();
      } catch {
        setError('Error al eliminar el gasto');
      }
    }
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

  // Mobile card component for expenses
  const ExpenseCard = ({ expense }: { expense: Expense }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box flex={1} mr={1}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {expense.title}
            </Typography>
            {expense.description && (
              <Typography 
                variant="body2" 
                color="textSecondary" 
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mt: 0.5,
                  wordBreak: 'break-word'
                }}
              >
                {expense.description}
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
            {formatCurrency(Number(expense.amount))}
          </Typography>
        </Box>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {expense.category && (
              <Chip
                label={expense.category.name}
                size="small"
                style={{ 
                  backgroundColor: expense.category.color, 
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
              {formatDate(expense.date)}
            </Typography>
          </Box>
          
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(expense)}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Edit fontSize={isSmallMobile ? 'small' : 'medium'} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(expense.id)}
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
            Gastos
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
            {isSmallMobile ? <Add /> : 'Nuevo Gasto'}
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
            {expenses.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No hay gastos registrados
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              expenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
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
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No hay gastos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2">
                                {expense.title}
                              </Typography>
                              {expense.description && (
                                <Typography variant="body2" color="textSecondary">
                                  {expense.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {expense.category && (
                              <Chip
                                label={expense.category.name}
                                size="small"
                                style={{ backgroundColor: expense.category.color, color: 'white' }}
                              />
                            )}
                          </TableCell>
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" color="primary">
                              {formatCurrency(Number(expense.amount))}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(expense)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(expense.id)}
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

        {/* Dialog para crear/editar gasto */}
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
            {editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
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
              type="number"
              fullWidth
              variant="outlined"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
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
              {editingExpense ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Expenses;
