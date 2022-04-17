const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// const PORT = 3000;
const PORT = process.env.PORT;
// 환경변수를 설정하지 않았다면 오류를 발생시킨다.
// 지정되지 않으 경우 기본 값을 사용하도록 구성할 수도 있다.
if (!PORT) {
  throw new Error(
    'HTTP 서버 구동을 위한 PORT 환경변수 설정이 존재하지 않습니다.'
  );
}

app.get('/video', (req, res) => {
  const filePath = path.join('./assets/video', 'SampleVideo_1280x720_30mb.mp4');

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('오류가 발생했습니다.');
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': 'video/mp4',
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
