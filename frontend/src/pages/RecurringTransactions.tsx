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
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { recurringTransactionsService, categoriesService } from '../services/api';
import type { RecurringTransaction, Category, CreateRecurringTransactionRequest } from '../services/api';
import { RecurringFrequency, TransactionType } from '../services/api';

const RecurringTransactions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [formData, setFormData] = useState<CreateRecurringTransactionRequest>({
    title: '',
    description: '',
    amount: 0,
    frequency: RecurringFrequency.MONTHLY,
    type: TransactionType.EXPENSE,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: undefined,
    isActive: true,
    categoryId: undefined,
  });

  useEffect(() => {
    fetchRecurringTransactions();
    fetchCategories();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      const data = await recurringTransactionsService.getAll();
      setRecurringTransactions(data);
    } catch {
      setError('Error al cargar las transacciones recurrentes');
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

  const handleOpenDialog = (transaction?: RecurringTransaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        title: transaction.title,
        description: transaction.description || '',
        amount: Number(transaction.amount),
        frequency: transaction.frequency,
        type: transaction.type,
        startDate: transaction.startDate,
        endDate: transaction.endDate,
        isActive: transaction.isActive,
        categoryId: transaction.categoryId,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        title: '',
        description: '',
        amount: 0,
        frequency: RecurringFrequency.MONTHLY,
        type: TransactionType.EXPENSE,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: undefined,
        isActive: true,
        categoryId: undefined,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleOpenConfirmDialog = (id: number) => {
    setTransactionToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setTransactionToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDeleteId) {
      try {
        await recurringTransactionsService.delete(transactionToDeleteId);
        fetchRecurringTransactions();
        setSnackbarMessage('Transacción recurrente eliminada correctamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch {
        setError('Error al eliminar la transacción recurrente');
        setSnackbarMessage('Error al eliminar la transacción recurrente');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        handleCloseConfirmDialog();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingTransaction) {
        await recurringTransactionsService.update(editingTransaction.id, formData);
        setSnackbarMessage('Transacción recurrente actualizada correctamente');
        setSnackbarSeverity('success');
      } else {
        await recurringTransactionsService.create(formData);
        setSnackbarMessage('Transacción recurrente creada correctamente');
        setSnackbarSeverity('success');
      }
      handleCloseDialog();
      fetchRecurringTransactions();
      setSnackbarOpen(true);
    } catch {
      setError('Error al guardar la transacción recurrente');
      setSnackbarMessage('Error al guardar la transacción recurrente');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    handleOpenConfirmDialog(id);
  };

  const handleToggleActive = async (transaction: RecurringTransaction) => {
    try {
      await recurringTransactionsService.update(transaction.id, {
        isActive: !transaction.isActive,
      });
      fetchRecurringTransactions();
      setSnackbarMessage(
        `Transacción ${!transaction.isActive ? 'activada' : 'desactivada'} correctamente`
      );
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('Error al cambiar el estado de la transacción');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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

  const getFrequencyLabel = (frequency: RecurringFrequency) => {
    const labels = {
      [RecurringFrequency.DAILY]: 'Diaria',
      [RecurringFrequency.WEEKLY]: 'Semanal',
      [RecurringFrequency.MONTHLY]: 'Mensual',
      [RecurringFrequency.YEARLY]: 'Anual',
    };
    return labels[frequency];
  };

  const getTypeLabel = (type: TransactionType) => {
    return type === TransactionType.EXPENSE ? 'Gasto' : 'Ingreso';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Mobile card component for recurring transactions
  const RecurringTransactionCard = ({ transaction }: { transaction: RecurringTransaction }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box flex={1} mr={1}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {transaction.title}
            </Typography>
            {transaction.description && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mt: 0.5,
                  wordBreak: 'break-word'
                }}
              >
                {transaction.description}
              </Typography>
            )}
          </Box>
          <Typography
            variant="h6"
            color={transaction.type === TransactionType.EXPENSE ? "error" : "success"}
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 600,
              minWidth: 'fit-content'
            }}
          >
            {formatCurrency(Number(transaction.amount))}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Chip
              label={getFrequencyLabel(transaction.frequency)}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={getTypeLabel(transaction.type)}
              size="small"
              color={transaction.type === TransactionType.EXPENSE ? "error" : "success"}
            />
            {transaction.category && (
              <Chip
                label={transaction.category.name}
                size="small"
                style={{
                  backgroundColor: transaction.category.color,
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
              Inicio: {formatDate(transaction.startDate)}
            </Typography>
          </Box>

          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              onClick={() => handleToggleActive(transaction)}
              color={transaction.isActive ? "success" : "default"}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              {transaction.isActive ? <Stop /> : <PlayArrow />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(transaction)}
              sx={{ p: { xs: 0.5, sm: 1 } }}
            >
              <Edit fontSize={isSmallMobile ? 'small' : 'medium'} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(transaction.id)}
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
              Transacciones Recurrentes
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
              {isSmallMobile ? <Add /> : 'Nueva Transacción'}
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
              {recurringTransactions.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">
                      No hay transacciones recurrentes registradas
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                recurringTransactions.map((transaction) => (
                  <RecurringTransactionCard key={transaction.id} transaction={transaction} />
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
                        <TableCell>Tipo</TableCell>
                        <TableCell>Frecuencia</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Fecha Inicio</TableCell>
                        <TableCell align="right">Monto</TableCell>
                        <TableCell align="center">Estado</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recurringTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            No hay transacciones recurrentes registradas
                          </TableCell>
                        </TableRow>
                      ) : (
                        recurringTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2">
                                  {transaction.title}
                                </Typography>
                                {transaction.description && (
                                  <Typography variant="body2" color="textSecondary">
                                    {transaction.description}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getTypeLabel(transaction.type)}
                                size="small"
                                color={transaction.type === TransactionType.EXPENSE ? "error" : "success"}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getFrequencyLabel(transaction.frequency)}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {transaction.category && (
                                <Chip
                                  label={transaction.category.name}
                                  size="small"
                                  style={{ backgroundColor: transaction.category.color, color: 'white' }}
                                />
                              )}
                            </TableCell>
                            <TableCell>{formatDate(transaction.startDate)}</TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="h6"
                                color={transaction.type === TransactionType.EXPENSE ? "error" : "success"}
                              >
                                {formatCurrency(Number(transaction.amount))}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={transaction.isActive ? 'Activa' : 'Inactiva'}
                                size="small"
                                color={transaction.isActive ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleToggleActive(transaction)}
                                color={transaction.isActive ? "success" : "default"}
                              >
                                {transaction.isActive ? <Stop /> : <PlayArrow />}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(transaction)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(transaction.id)}
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

          {/* Dialog para crear/editar transacción recurrente */}
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
              {editingTransaction ? 'Editar Transacción Recurrente' : 'Nueva Transacción Recurrente'}
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
                value={formData.amount === 0 && editingTransaction === null ? '' : formData.amount}
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
                label="Tipo"
                fullWidth
                variant="outlined"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              >
                <MenuItem value={TransactionType.EXPENSE}>Gasto</MenuItem>
                <MenuItem value={TransactionType.INCOME}>Ingreso</MenuItem>
              </TextField>
              <TextField
                select
                margin="dense"
                label="Frecuencia"
                fullWidth
                variant="outlined"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontSize: { xs: '1rem', sm: '1rem' }
                  }
                }}
              >
                <MenuItem value={RecurringFrequency.DAILY}>Diaria</MenuItem>
                <MenuItem value={RecurringFrequency.WEEKLY}>Semanal</MenuItem>
                <MenuItem value={RecurringFrequency.MONTHLY}>Mensual</MenuItem>
                <MenuItem value={RecurringFrequency.YEARLY}>Anual</MenuItem>
              </TextField>
              <DatePicker
                label="Fecha de Inicio"
                value={dayjs(formData.startDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, startDate: newValue.format('YYYY-MM-DD') });
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
              <DatePicker
                label="Fecha de Fin (opcional)"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(newValue) => {
                  setFormData({
                    ...formData,
                    endDate: newValue ? newValue.format('YYYY-MM-DD') : undefined
                  });
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
                {editingTransaction ? 'Actualizar' : 'Crear'}
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
                ¿Estás seguro de que quieres eliminar esta transacción recurrente? Esta acción no se puede deshacer.
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

export default RecurringTransactions;
