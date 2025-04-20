import cheerio from 'cheerio'; // LET OP: nodig om HTML te parsen

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { date, time, place } = req.body;

  // Locatie ophalen (lat/lon)
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
  const locations = await response.json();

  if (!locations.length) {
    return res.status(404).json({ error: 'Plaats niet gevonden' });
  }

  const lat = locations[0].lat;
  const lon = locations[0].lon;

  // Datum en tijd splitsen
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  // Maak een formulier-achtige request naar AstroSeek
  const formData = new URLSearchParams();
  formData.append('inputyear', year);
  formData.append('inputmonth', month);
  formData.append('inputday', day);
  formData.append('inputhour', hour);
  formData.append('inputmin', minute);
  formData.append('inputcity', place);
  formData.append('inputlon', lon);
  formData.append('inputlat', lat);

  const astroResponse = await fetch('https://horoscopes.astro-seek.com/birth-chart-horoscope-online', {
    method: 'POST',
    body: formData
  });

  const html = await astroResponse.text();
  const $ = cheerio.load(html);

  // Hier moeten we slim zoeken naar Zon, Maan, Ascendant info
  // (ik maak nu alvast een basis, maar ik check daarna nog hoe AstroSeek de pagina structureert)

  const sunSign = $('td:contains("Sun")').next().text().trim();
  const moonSign = $('td:contains("Moon")').next().text().trim();
  const ascendantSign = $('td:contains("Ascendant")').next().text().trim();

  res.status(200).json({
    date,
    time,
    place,
    latitude: lat,
    longitude: lon,
    sunSign,
    moonSign,
    ascendantSign
  });
}
