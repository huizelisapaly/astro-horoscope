export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { date, time, place } = req.body;

  // Locatie ophalen
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
  const locations = await response.json();

  if (!locations.length) {
    return res.status(404).json({ error: 'Plaats niet gevonden' });
  }

  const lat = parseFloat(locations[0].lat);
  const lon = parseFloat(locations[0].lon);

  // Datum en tijd splitsen
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  // Request naar Astronapi sturen
  const astroResponse = await fetch('https://api.astronapi.com/api/v1/planets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      day,
      month,
      year,
      hour,
      minute,
      latitude: lat,
      longitude: lon,
      timezone: 1 // Nederland tijdzone
    })
  });

  const astroData = await astroResponse.json();

  // Verstuur alles terug naar frontend
  res.status(200).json({
    date,
    time,
    place,
    latitude: lat,
    longitude: lon,
    astroData
  });
}
