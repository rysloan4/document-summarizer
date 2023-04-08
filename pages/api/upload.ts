import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';

const handleFileUpload = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, (err, _fields, files) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(200).json({ message: 'File uploaded successfully' });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handleFileUpload;
