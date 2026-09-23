const https = require('https');

const urls = [
  'https://maps.app.goo.gl/ZFqzHQCXrAV6No4L9',
  'https://maps.app.goo.gl/mS1Y5xosruYVooXg6',
  'https://maps.app.goo.gl/6xnWDXd971P1TaFQ7',
  'https://maps.app.goo.gl/Lep9PYazHqrXJp8U9'
];

async function resolveUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(url);
      }
    }).on('error', (err) => resolve(url));
  });
}

async function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    console.log(`\n=== LINK ${i + 1}: ${u} ===`);
    const redirected = await resolveUrl(u);
    console.log('Redirected to:', redirected);
    const html = await fetchPage(redirected);
    
    // Extract metadata
    const ogTitle = html.match(/property="og:title"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:title"/);
    const ogDesc = html.match(/property="og:description"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:description"/);
    const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/) || html.match(/content="([^"]+)"\s+property="og:image"/);
    
    if (ogTitle) console.log('OG Title:', ogTitle[1]);
    if (ogDesc) console.log('OG Description:', ogDesc[1]);
    if (ogImage) console.log('OG Image:', ogImage[1]);

    // Look for images in html: googleusercontent or ggpht
    const photoMatches = Array.from(html.matchAll(/https:\/\/lh[0-9]\.googleusercontent\.com\/p\/[a-zA-Z0-9_-]+/g)).map(m => m[0]);
    const uniquePhotos = Array.from(new Set(photoMatches));
    console.log(`Found ${uniquePhotos.length} photos:`);
    uniquePhotos.slice(0, 10).forEach(p => console.log('  Photo:', p));
  }
}

run();
