FROM node:14.17.0-alpine AS builder
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# production environment
FROM nginx:stable-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
