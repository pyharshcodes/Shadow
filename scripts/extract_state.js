const fs = require('fs');
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
  fs.writeFileSync('scripts/maps_response.html', html);
  console.log('Saved to scripts/maps_response.html');

  // Let's find window.APP_INITIALIZATION_STATE
  const stateMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[.+?\]);/s);
  if (stateMatch) {
    console.log('Found APP_INITIALIZATION_STATE');
    const state = JSON.parse(stateMatch[1]);
    console.log('State length:', state.length);
    for (let i = 0; i < state.length; i++) {
      if (typeof state[i] === 'string' && state[i].includes('SHADOW FITNESS')) {
        console.log(`state[${i}] has SHADOW FITNESS, length:`, state[i].length);
        fs.writeFileSync(`scripts/state_${i}.txt`, state[i]);
      } else if (Array.isArray(state[i])) {
        const str = JSON.stringify(state[i]);
        if (str.includes('SHADOW FITNESS')) {
          console.log(`state[${i}] (array) has SHADOW FITNESS, length:`, str.length);
          fs.writeFileSync(`scripts/state_${i}.json`, str);
        }
      }
    }
  }
}

run();
