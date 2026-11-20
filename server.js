const express = require('express');
const path = require('node:path');
const fs = require('node:fs');

const app = express();
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

app.use(express.static(distDir, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.use((req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.sendFile(indexPath);
  }
  return res.status(404).send('Build output not found. Run npm run build first.');
});

app.listen(port, host, () => {
  console.log(`OVERDRIVE server listening on http://${host}:${port}`);
});
