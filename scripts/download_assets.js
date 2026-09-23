const fs = require('fs');
const path = require('path');
const https = require('https');

const photoLinks = [
  {
    name: 'photo_1.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmPm_6LSUu_RBDp688-1YhwnQ1MC-ipg2ZvMI2mO7ufeMx9sLHRfqgLaCHPKUvrWRBAeHtiqyFBSvRr52nqj4RokbHW6JTr5aykz4AijssBxVi2saKQ2VDZKascZBwy339NbzCdiq3taXhA=s1600'
  },
  {
    name: 'photo_2.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlL2Ctttl5n4nqGSh3cHitaCO3a4zTmxnu0OUWZEbJsgXSCSg1rIsugz_AR7ZUaPNoRCGnJ9dXptpKZInqzVfe5QCoBJ6nElMuOd0DuHGqPy3WrxaSR0wf09ljPK5_kWvLhWq59W532TzY9=s1600'
  },
  {
    name: 'photo_3.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk4hA8IDBvOVQsaLfTYl4uXGJAd7-aHTBnHPVhO1qPrSFVsiCP09D6W-PXo2OpjWGUMOgKsGIFJjUpr4Zl9qQ-vLo9QyEdc725IysjzycEpljjYj_Vqm9BhtCsvYEjjRB4xzLkxoiTEAibW=s1600'
  },
  {
    name: 'photo_4.jpg',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkeAp_7iR760ErBsDrx44b44fbPIloHIHznWLXLV7VMgY-hCGPh-HaExmgfWkZCzDYbtNvq6EwczcFJolzwS8VasEFXa0SAOKRjtt512J7FB-fAsW9ZkTZ_UpYZZ_ltCzMBAwvwGFfRml_F=s1600'
  }
];

const destDir = path.join(__dirname, '../public/images/gym');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stat = fs.statSync(dest);
        console.log(`Downloaded ${path.basename(dest)}: ${stat.size} bytes`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of photoLinks) {
    const target = path.join(destDir, item.name);
    try {
      await download(item.url, target);
    } catch (e) {
      console.error(`Failed to download ${item.name}:`, e.message);
    }
  }

  // Copy uploaded logo to public/images/brand/logo.png and public/logo.png
  const uploadedLogo = 'C:/Users/harsh/.gemini/antigravity/brain/a9e5dc74-05b6-4f59-bfb1-c5ddc8f74c22/.user_uploaded/media_1790144076024.png';
  const brandDir = path.join(__dirname, '../public/images/brand');
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }
  if (fs.existsSync(uploadedLogo)) {
    fs.copyFileSync(uploadedLogo, path.join(brandDir, 'logo.png'));
    fs.copyFileSync(uploadedLogo, path.join(__dirname, '../public/logo.png'));
    console.log('Copied official logo to public/images/brand/logo.png and public/logo.png');
  }
}

run();
