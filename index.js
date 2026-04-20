const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que nuestro dashboard frontend se conecte

const PORT = process.env.PORT || 3000;
const LOCATION_ID = 'FPa1edMih64zzU5Ioviz';

app.get('/api/ventas', async (req, res) => {
  try {
    const response = await fetch(`https://services.leadconnectorhq.com/opportunities/search?location_id=${LOCATION_ID}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Version': '2021-07-28'
      }
    });
    
    if (!response.ok) throw new Error('Error en la API');
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
