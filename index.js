import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const main = async () => {
  const client = await google.auth.getClient({
    keyFile: '/home/frankhuang0917_gmail_com/upload-mc-gdrive/credentials.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const gDrive = google.drive({
    version: 'v3',
    auth: client,
  });

  const now = new Date();
  now.setTime(now.getTime() + 8 * 60 * 60 * 1000);
  const name = `${now
    .toLocaleString('zh-cn', { hourCycle: 'h23' })
    .replace(/ /g, '_')
    .replace(/\//g, '-')}`;

  const listData = await gDrive.files.list({
    q: `'parent-id' in parents`,
    fields: 'files(id, createdTime, name)',
  });

  const files = listData.data.files
    .map(({ id, createdTime, name }) => ({
      id,
      createdTime: new Date(createdTime).getTime(),
      time: createdTime,
      name,
    }))
    .sort((a, b) => a.createdTime < b.createdTime);

  if (files.length > 10) {
    const toBeDeleted = files.slice(9);
    try {
      await Promise.all(
        toBeDeleted.map((file) => gDrive.files.delete({ fileId: file.id })),
      );
    } catch (e) {
      fs.writeFileSync(
        `/home/frankhuang0917_gmail_com/upload-mc-gdrive/log/error/delete-${name}.txt`,
        JSON.stringify(e.response.data.error, null, 2),
      );
    }
  }

  try {
    await gDrive.files.create({
      media: {
        body: fs.createReadStream(
          path.resolve('/opt/minecraft/create-mod/world.zip'),
        ),
      },
      requestBody: {
        name: `${name}.zip`,
        parents: ['parent-id'],
      },
    });
  } catch (e) {
    fs.writeFileSync(
      `/home/frankhuang0917_gmail_com/upload-mc-gdrive/log/error/${name}.txt`,
      JSON.stringify(e.response.data.error, null, 2),
    );
  }
};

main();
