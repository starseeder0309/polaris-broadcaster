const http = require('http');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT, 10);
if (!PORT || !VIDEO_STORAGE_HOST || !VIDEO_STORAGE_PORT) {
  throw new Error(
    'HTTP 서버 구동을 위한 PORT 환경변수 설정이 존재하지 않습니다.'
  );
}

app.get('/video', (req, res) => {
  const forwardRequest = http.request(
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: '/video?filePath=SampleVideo_1280x720_30mb.mp4',
      method: 'GET',
      headers: req.headers,
    },
    (forwardResponse) => {
      res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
      forwardResponse.pipe(res);
    }
  );

  req.pipe(forwardRequest);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
