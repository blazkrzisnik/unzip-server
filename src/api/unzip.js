import { buffer } from 'micro';
import AdmZip from 'adm-zip';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ version: '1.0.0' });
  }

  if (req.method === 'POST') {
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
      return res.status(500).json({ error: 'Failed to unzip' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
