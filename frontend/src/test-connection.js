// Script simple para probar la conexión con el backend
const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:3001');
    console.log('Backend status:', response.status);
    
    // Probar endpoint de documentación
    const swaggerResponse = await fetch('http://localhost:3001/api-json');
    console.log('Swagger API status:', swaggerResponse.status);
    
    console.log('✅ Backend está funcionando correctamente');
  } catch (error) {
    console.error('❌ Error conectando con el backend:', error);
  }
};

testConnection();
