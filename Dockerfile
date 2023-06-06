FROM node:20-bullseye-slim as builder

RUN mkdir /tmp/diceware
COPY . /tmp/diceware/
WORKDIR /tmp/diceware

RUN npm run build

FROM nginx:1.25-bullseye

COPY --from=builder /tmp/diceware/assets /usr/share/nginx/html/assets/
COPY --from=builder /tmp/diceware/dist /usr/share/nginx/html/dist/
COPY --from=builder /tmp/diceware/fonts /usr/share/nginx/html/fonts
COPY --from=builder /tmp/diceware/favicon.ico /usr/share/nginx/html/favicon.ico
COPY --from=builder /tmp/diceware/index.html /usr/share/nginx/html/index.html
COPY --from=builder /tmp/diceware/robots.txt /usr/share/nginx/html/robots.txt

RUN chmod -R a+rX /usr/share/nginx/html
