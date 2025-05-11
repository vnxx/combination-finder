# build-client
FROM node:22-alpine AS build-client
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN rm -rf node_modules

# build-backend
FROM golang:alpine AS build-backend
WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o combination-finder.site

# release
FROM golang:alpine AS release
WORKDIR /app

COPY --from=build-backend /app/combination-finder.site /app/combination-finder.site
COPY --from=build-client /app/public /app/public
COPY resources ./resources

EXPOSE 8008

CMD ["./combination-finder.site"]

