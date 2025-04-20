export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { date, time, place } = req.body;

  // 1. Locatie ophalen
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`);
  const locations = await response.json();

  if (!locations.length) {
    return res.status(404).json({ error: 'Plaats niet gevonden' });
  }

  const lat = locations[0].lat;
  const lon = locations[0].lon;

  // 2. Simpele astrologische interpretatie
  const [year, month, day] = date.split('-').map(Number);

  // Simulatie: Bepaal zonneteken puur op geboortemaand
  let sunSign = "Onbekend";

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = "Ram";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = "Stier";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = "Tweelingen";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = "Kreeft";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = "Leeuw";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = "Maagd";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = "Weegschaal";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = "Schorpioen";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = "Boogschutter";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = "Steenbok";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = "Waterman";
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = "Vissen";

  res.status(200).json({
    date,
    time,
    place,
    latitude: lat,
    longitude: lon,
    sunSign: sunSign,
    note: "Dit is je zonneteken! (Later voegen we Maan, Ascendant en Huizen toe!)"
  });
}
