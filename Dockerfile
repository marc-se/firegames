FROM node:6.4.0
# Workaround for npm AUFS EXDEV bug introduced in node 5+ (https://github.com/npm/npm/issues/9863)
RUN cd $(npm root -g)/npm \
 && npm install fs-extra \
 && sed -i -e s/graceful-fs/fs-extra/ -e s/fs\.rename/fs\.move/ ./lib/utils/rename.js
RUN npm install --global nodemon
WORKDIR /webapp
ENV NODE_ENV=production
ADD package.json npm-shrinkwrap.json .npmrc /webapp/
RUN unset NODE_ENV; npm install --quiet # Makes npm install all dependencies
ADD . /webapp/
RUN npm run build --loglevel warn
CMD npm start
