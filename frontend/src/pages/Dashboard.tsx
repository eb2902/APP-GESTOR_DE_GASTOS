import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Receipt,
  Category as CategoryIcon,
  AccountBalanceWallet,
  AttachMoney, // Import for incomes icon
} from '@mui/icons-material';
import { expensesService, categoriesService, incomesService } from '../services/api';
import type { Expense, Income } from '../services/api';

interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  totalIncomes: number;
  monthlyIncomes: number;
  expenseCount: number;
  incomeCount: number;
  categoryCount: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    monthlyExpenses: 0,
    totalIncomes: 0,
    monthlyIncomes: 0,
    expenseCount: 0,
    incomeCount: 0,
    categoryCount: 0,
  });
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [recentIncomes, setRecentIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener gastos
        const expenses = await expensesService.getAll();
        // Obtener ingresos
        const incomes = await incomesService.getAll();
        // Obtener categorías
        const categories = await categoriesService.getAll();
        
        // Calcular estadísticas de gastos
        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        
        // Calcular estadísticas de ingresos
        const totalIncomes = incomes.reduce((sum, income) => sum + Number(income.amount), 0);

        // Total del mes actual
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        let monthlyExpenses = 0;
        try {
          monthlyExpenses = await expensesService.getMonthlyTotal(currentYear, currentMonth);
        } catch (_) {
          // Calcular manualmente si falla la API
          const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === currentYear && 
                   expenseDate.getMonth() + 1 === currentMonth;
          });
          monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        }

        let monthlyIncomes = 0;
        try {
          monthlyIncomes = await incomesService.getMonthlyTotal(currentYear, currentMonth);
        } catch (_) {
          // Calcular manualmente si falla la API
          const currentMonthIncomes = incomes.filter(income => {
            const incomeDate = new Date(income.date);
            return incomeDate.getFullYear() === currentYear && 
                   incomeDate.getMonth() + 1 === currentMonth;
          });
          monthlyIncomes = currentMonthIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
        }
        
        setStats({
          totalExpenses,
          monthlyExpenses,
          totalIncomes,
          monthlyIncomes,
          expenseCount: expenses.length,
          incomeCount: incomes.length,
          categoryCount: categories.length,
        });
        
        // Obtener los últimos 5 gastos
        setRecentExpenses(expenses.slice(0, 5));
        // Obtener los últimos 5 ingresos
        setRecentIncomes(incomes.slice(0, 5));
        
      } catch (_err) {
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const statCards = [
    {
      title: 'Total Gastos',
      value: formatCurrency(stats.totalExpenses),
      icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#d32f2f' }} />, // Red for expenses
      color: '#ffebee',
    },
    {
      title: 'Gastos del Mes',
      value: formatCurrency(stats.monthlyExpenses),
      icon: <TrendingUp sx={{ fontSize: 40, color: '#ef5350' }} />, // Lighter red
      color: '#ffcdd2',
    },
    {
      title: 'Total Ingresos',
      value: formatCurrency(stats.totalIncomes),
      icon: <AttachMoney sx={{ fontSize: 40, color: '#2e7d32' }} />, // Green for incomes
      color: '#e8f5e8',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.monthlyIncomes),
      icon: <TrendingUp sx={{ fontSize: 40, color: '#66bb6a' }} />, // Lighter green
      color: '#c8e6c9',
    },
    {
      title: 'Número de Gastos',
      value: stats.expenseCount.toString(),
      icon: <Receipt sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Número de Ingresos',
      value: stats.incomeCount.toString(),
      icon: <Receipt sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Categorías',
      value: stats.categoryCount.toString(),
      icon: <CategoryIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      color: '#f3e5f5',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: card.color }}>
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                  <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                    <Typography 
                      color="textSecondary" 
                      gutterBottom 
                      variant="h6"
                      sx={{ fontSize: { xs: '0.75rem', sm: '1.25rem' } }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h4"
                      component="div"
                      sx={{ fontSize: { xs: '1rem', sm: '2.125rem' } }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ alignSelf: 'flex-end' }}>
                    {React.cloneElement(card.icon, {
                      sx: { fontSize: { xs: 24, sm: 40 }, color: card.icon.props.sx.color }
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gastos e Ingresos recientes */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gastos Recientes
              </Typography>
              {recentExpenses.length === 0 ? (
                <Typography color="textSecondary">
                  No hay gastos registrados aún.
                </Typography>
              ) : (
                <Box>
                  {recentExpenses.map((expense) => (
                    <Box
                      key={expense.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {expense.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {expense.category?.name} • {formatDate(expense.date)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="error">
                        {formatCurrency(Number(expense.amount))}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingresos Recientes
              </Typography>
              {recentIncomes.length === 0 ? (
                <Typography color="textSecondary">
                  No hay ingresos registrados aún.
                </Typography>
              ) : (
                <Box>
                  {recentIncomes.map((income) => (
                    <Box
                      key={income.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {income.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {income.category?.name} • {formatDate(income.date)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="success.main">
                        {formatCurrency(Number(income.amount))}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
