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
} from '@mui/icons-material';
import { expensesService, categoriesService } from '../services/api';
import type { Expense, Category } from '../services/api';

interface DashboardStats {
  totalExpenses: number;
  monthlyTotal: number;
  expenseCount: number;
  categoryCount: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    monthlyTotal: 0,
    expenseCount: 0,
    categoryCount: 0,
  });
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener gastos
        const expenses = await expensesService.getAll();
        
        // Obtener categorías
        const categories = await categoriesService.getAll();
        
        // Calcular estadísticas
        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        
        // Total del mes actual
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        let monthlyTotal = 0;
        try {
          monthlyTotal = await expensesService.getMonthlyTotal(currentYear, currentMonth);
        } catch (monthlyError) {
          // Calcular manualmente si falla la API
          const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === currentYear && 
                   expenseDate.getMonth() + 1 === currentMonth;
          });
          monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        }
        
        setStats({
          totalExpenses,
          monthlyTotal,
          expenseCount: expenses.length,
          categoryCount: categories.length,
        });
        
        // Obtener los últimos 5 gastos
        setRecentExpenses(expenses.slice(0, 5));
        
      } catch (err) {
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
      icon: <AccountBalanceWallet sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Gastos del Mes',
      value: formatCurrency(stats.monthlyTotal),
      icon: <TrendingUp sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#e8f5e8',
    },
    {
      title: 'Número de Gastos',
      value: stats.expenseCount.toString(),
      icon: <Receipt sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#fff3e0',
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
          <Grid item xs={6} sm={6} md={3} key={index}>
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
                  <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
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

      {/* Gastos recientes */}
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
                  <Typography variant="h6" color="primary">
                    {formatCurrency(Number(expense.amount))}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
