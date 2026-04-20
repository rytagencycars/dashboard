const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const LOCATION_ID = 'FPa1edMih64zzU5Ioviz';

app.get('/api/ventas', async (req, res) => {
  try {
    let allOpportunities = [];
    let page = 1;
    const limit = 100;
    let fetchMore = true;

    // Bucle para obtener todas las páginas hasta que no queden más
    while (fetchMore) {
      const response = await fetch(`https://services.leadconnectorhq.com/opportunities/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locationId: LOCATION_ID,
          limit: limit,
          page: page
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Detalle del error:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const opps = data.opportunities || [];
      allOpportunities = allOpportunities.concat(opps);
      
      // Si nos devuelve menos de 100, significa que ya llegamos al final
      if (opps.length < limit) {
        fetchMore = false;
      } else {
        page++; // Pasamos a la siguiente página
      }
    }
    
    // Devolvemos todas las oportunidades juntas al dashboard
    res.json({ opportunities: allOpportunities });
  } catch (error) {
    console.error('Error en el servidor:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
