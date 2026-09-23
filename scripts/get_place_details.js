const https = require('https');

const placeUrl = 'https://www.google.com/maps/place/SHADOW+FITNESS/@27.0028867,79.2459083,17z/data=!4m6!3m5!1s0x3975f100055864b5:0x6f34f47c18119ba5!8m2!3d27.0028867!4d79.2459083!16s%2Fg%2F11yfrxx7f5?hl=en';

function get(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        get(res.headers.location).then(resolve);
        return;
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', err => resolve(''));
  });
}

async function run() {
  const html = await get(placeUrl);
  console.log('HTML Length:', html.length);
  
  // Look for address, phone, rating, reviews in window.APP_INITIALIZATION_STATE or APP_OPTIONS or raw text
  const phoneMatch = html.match(/\+91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\+91[\s-]?[0-9]{10}|0[0-9]{10}/g);
  console.log('Phone matches:', phoneMatch);

  // Search for address patterns (e.g. Pin code 6 digits, Uttar Pradesh, Road, etc.)
  const pinMatches = html.match(/[A-Za-z0-9\s,.-]+,\s*[A-Za-z\s]+[0-9]{6}/g) || html.match(/\b\d{6}\b/g);
  console.log('Pin matches:', pinMatches);

  // Search for strings containing SHADOW FITNESS and nearby text
  const idx = html.indexOf('SHADOW FITNESS');
  if (idx !== -1) {
    console.log('Snippet around SHADOW FITNESS:');
    console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 400)));
  }

  // Look for all high-res photos
  const photoMatches = Array.from(html.matchAll(/https:\/\/lh[0-9]\.googleusercontent\.com\/p\/[a-zA-Z0-9_-]+/g)).map(m => m[0]);
  const uniquePhotos = Array.from(new Set(photoMatches));
  console.log(`\nFound ${uniquePhotos.length} unique photos:`);
  uniquePhotos.forEach((p, i) => console.log(`Photo ${i + 1}: ${p}`));
  
  // Also look for gps-cs-s photos (which were in the user's links)
  const gpsMatches = Array.from(html.matchAll(/https:\/\/lh[0-9]\.googleusercontent\.com\/gps-cs-s\/[a-zA-Z0-9_-]+/g)).map(m => m[0]);
  const uniqueGps = Array.from(new Set(gpsMatches));
  console.log(`\nFound ${uniqueGps.length} unique gps photos:`);
  uniqueGps.forEach((p, i) => console.log(`GPS Photo ${i + 1}: ${p}`));
}

run();
