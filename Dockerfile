# 새로운 이미지를 만들기 위한 기본 이미지를 설정한다.
# 다른 이미지를 바탕으로 새로운 이미지를 생성한다.
FROM node:16.14.2-alpine

# 이미지 디렉터리를 설정한다.
# 다른 모든 경로는 이 위치의 상대 경로다.
WORKDIR /usr/src/app

# Node.js의 package.json 파일을 이미지에 복사한다.
COPY package*.json ./

# 운영 환경 종속성만 npm을 사용해 설치한다.
RUN npm install --only=production

# 마이크로서비스의 소스 코드를 복사한다.
COPY ./src ./src
# 샘플 비디오 파일을 복사한다.
COPY ./assets/video ./assets/video

# "npm start" 형태로 마이크로서비스를 시작한다.
CMD npm start
