FROM node:4.4.4-onbuild

MAINTAINER sinian.ssn <sinian.ssn@alibaba-inc.com>

EXPOSE 7001
ENTRYPOINT ["node", "app.js"]