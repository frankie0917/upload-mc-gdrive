import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const main = async () => {
  const client = await google.auth.getClient({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const gDrive = google.drive({
    version: 'v3',
    auth: client,
  });
  const now = new Date();
  const name = `${now.getHours()}:${now.getMinutes()}_${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()}.zip`;

  await gDrive.files.create({
    media: {
      body: fs.createReadStream(path.resolve('./world.zip')),
    },
    requestBody: {
      name,
      parents: ['parent-id'],
    },
  });
};

main();
