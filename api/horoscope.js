export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { date, time, place } = req.body;

  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
  const locations = await response.json();

  if (!locations.length) {
    return res.status(404).json({ error: 'Plaats niet gevonden' });
  }

  const lat = locations[0].lat;
  const lon = locations[0].lon;

  res.status(200).json({
    message: 'Geboortegegevens ontvangen!',
    date, time, place,
    latitude: lat,
    longitude: lon,
    note: 'Hier voegen we later planeten en huizen toe!'
  });
}
