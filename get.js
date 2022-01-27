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
  const {
    data: { storageQuota },
  } = await gDrive.about.get({
    fields: ['storageQuota'],
  });
  for (const key in storageQuota) {
    storageQuota[key] = humanFileSize(Number(storageQuota[key]));
  }
  console.log(storageQuota);
};

main();

function humanFileSize(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}
