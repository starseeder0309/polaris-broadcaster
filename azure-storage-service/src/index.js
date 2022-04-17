const express = require('express');
const dotenv = require('dotenv');
const azureStorage = require('azure-storage');

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
if (!PORT || !STORAGE_ACCOUNT_NAME || !STORAGE_ACCESS_KEY) {
  throw new Error(`HTTP 서버 구동을 위한 환경변수 설정이 존재하지 않습니다.`);
}

const createBlobService = () => {
  return azureStorage.createBlobService(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCESS_KEY
  );
};

app.get('/video', (req, res) => {
  const { filePath } = req.query;

  const blobService = createBlobService();
  const containerName = 'video';

  blobService.getBlobProperties(containerName, filePath, (err, properties) => {
    if (err) {
      console.error(
        `[getBlobProperties] 비디오 파일(${containerName}/${filePath})을 가져오는 과정에서 오류가 발생했습니다.`
      );
      console.error((err && err.stack) || err);
      return res.sendStatus(500);
    }

    res.writeHead(200, {
      'Content-Length': properties.contentLength,
      'Content-Type': 'video/mp4',
    });

    blobService.getBlobToStream(containerName, filePath, res, (err) => {
      if (err) {
        console.error(
          `[getBlobToStream] 비디오 파일(${containerName}/${filePath})을 가져오는 과정에서 오류가 발생했습니다.`
        );
        console.error((err && err.stack) || err);
        return res.sendStatus(500);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
