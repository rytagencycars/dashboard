const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const LOCATION_ID = 'FPa1edMih64zzU5Ioviz';

app.get('/api/ventas', async (req, res) => {
  try {
    // Usamos POST para el endpoint de búsqueda
    const response = await fetch(`https://services.leadconnectorhq.com/opportunities/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location_id: LOCATION_ID
      })
    });
    
    if (!response.ok) {
      // Si falla, leemos el error exacto de la API
      const errorText = await response.text();
      console.error('Detalle del error de la API:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error en el servidor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
