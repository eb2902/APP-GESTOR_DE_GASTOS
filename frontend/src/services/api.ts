import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      console.log('Token inválido, limpiando datos de autenticación');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // No redirigir automáticamente, dejar que el contexto de autenticación maneje esto
    }
    return Promise.reject(error);
  }
);

// Tipos de datos
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  date: string;
  userId: number;
  categoryId?: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  date: string;
  categoryId?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

// Servicios de autenticación
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Servicios de categorías
export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Servicios de gastos
export const expensesService = {
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: number;
  }): Promise<Expense[]> => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateExpenseRequest>): Promise<Expense> => {
    const response = await api.patch(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getMonthlyTotal: async (year: number, month: number): Promise<number> => {
    const response = await api.get(`/expenses/stats/monthly/${year}/${month}`);
    return response.data;
  },
};
