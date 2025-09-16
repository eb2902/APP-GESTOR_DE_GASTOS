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
import { budgetsService, categoriesService } from '../services/api';
import type { Budget, Category, CreateBudgetRequest } from '../services/api';

const Budgets: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [budgetToDeleteId, setBudgetToDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [formData, setFormData] = useState<CreateBudgetRequest>({
    title: '',
    description: '',
    amount: 0,
    period: 'monthly' as string,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    categoryId: undefined,
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetsService.getAll();
      setBudgets(data);
    } catch {
      setError('Error al cargar los presupuestos');
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

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        title: budget.title,
        description: budget.description || '',
        amount: Number(budget.amount),
        period: budget.period,
        year: budget.year,
        month: budget.month,
        categoryId: budget.categoryId,
      });
    } else {
      setEditingBudget(null);
      setFormData({
        title: '',
        description: '',
        amount: 0,
        period: 'monthly',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        categoryId: undefined,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
  };

  const handleOpenConfirmDialog = (id: number) => {
    setBudgetToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setBudgetToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDeleteId) {
      try {
        await budgetsService.delete(budgetToDeleteId);
        fetchBudgets();
        setSnackbarMessage('Presupuesto eliminado correctamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch {
        setError('Error al eliminar el presupuesto');
        setSnackbarMessage('Error al eliminar el presupuesto');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingBudget) {
        await budgetsService.update(editingBudget.id, formData);
        setSnackbarMessage('Presupuesto actualizado correctamente');
        setSnackbarSeverity('success');
      } else {
        await budgetsService.create(formData);
        setSnackbarMessage('Presupuesto creado correctamente');
        setSnackbarSeverity('success');
      }
      handleCloseDialog();
      fetchBudgets();
      setSnackbarOpen(true);
    } catch {
      setError('Error al guardar el presupuesto');
      setSnackbarMessage('Error al guardar el presupuesto');
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

  const getPeriodLabel = (period: string, month?: number) => {
    if (period === 'annual') {
      return 'Anual';
    }
    return month ? `Mensual - ${new Date(0, month - 1).toLocaleString('es-ES', { month: 'long' })}` : 'Mensual';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Mobile card component for budgets
  const BudgetCard = ({ budget }: { budget: Budget }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box flex={1} mr={1}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {budget.title}
            </Typography>
            {budget.description && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mt: 0.5,
                  wordBreak: 'break-word'
                }}
              >
                {budget.description}
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
            {formatCurrency(Number(budget.amount))}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {budget.category && (
              <Chip
                label={budget.category.name}
                size="small"
                style={{
                  backgroundColor: budget.category.color,
                  color: 'white',
                  fontSize: isSmallMobile ? '0.6875rem' : '0.75rem'
                }}
              />
            )}
            <Chip
              label={getPeriodLabel(budget.period, budget.month)}
              size="small"
              variant="outlined"
              sx={{ fontSize: isSmallMobile ? '0.6875rem' : '0.75rem' }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {budget.year}
            </Typography>
          </Box>

          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(budget)}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Edit fontSize={isSmallMobile ? 'small' : 'medium'} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(budget.id)}
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
            Presupuestos
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
            {isSmallMobile ? <Add /> : 'Nuevo Presupuesto'}
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
            {budgets.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="textSecondary">
                    No hay presupuestos registrados
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
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
                      <TableCell>Período</TableCell>
                      <TableCell>Año</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No hay presupuestos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      budgets.map((budget) => (
                        <TableRow key={budget.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2">
                                {budget.title}
                              </Typography>
                              {budget.description && (
                                <Typography variant="body2" color="textSecondary">
                                  {budget.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {budget.category && (
                              <Chip
                                label={budget.category.name}
                                size="small"
                                style={{ backgroundColor: budget.category.color, color: 'white' }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getPeriodLabel(budget.period, budget.month)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{budget.year}</TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" color="primary">
                              {formatCurrency(Number(budget.amount))}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(budget)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(budget.id)}
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

        {/* Dialog para crear/editar presupuesto */}
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
            {editingBudget ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
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
              value={formData.amount === 0 && editingBudget === null ? '' : formData.amount}
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
            <TextField
              select
              margin="dense"
              label="Período"
              fullWidth
              variant="outlined"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                }
              }}
            >
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="annual">Anual</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Año"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1rem' }
                }
              }}
            />
            {formData.period === 'monthly' && (
              <TextField
                select
                margin="dense"
                label="Mes"
                fullWidth
                variant="outlined"
                value={formData.month || ''}
                onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
              {editingBudget ? 'Actualizar' : 'Crear'}
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
              ¿Estás seguro de que quieres eliminar este presupuesto? Esta acción no se puede deshacer.
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
  );
};

export default Budgets;
