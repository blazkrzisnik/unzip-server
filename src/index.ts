import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { buffer } from 'micro';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.post('/unzip', async (req, res) => {
  try {
    const buf = await buffer(req); // preberi binarni ZIP
    const zip = new AdmZip(buf);
    const files = zip.getEntries().map(entry => ({
      name: entry.entryName,
      data: entry.getData().toString('base64'), // vrne v base64
    }));

    return res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to unzip', err });
  }
})

export default app
