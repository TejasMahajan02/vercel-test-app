FROM node:lts-alpine3.17 As build
WORKDIR /vercel-test-app
COPY ./package.json ./package.json
RUN npm i
COPY . /vercel-test-app
RUN npm run build

# node:alpine3.16 or node:16.13.1
FROM node:lts-alpine3.17 As dev
WORKDIR /vercel-test-app

COPY --from=build /vercel-test-app/.env /vercel-test-app/.env
COPY --from=build /vercel-test-app/node_modules /vercel-test-app/node_modules
COPY --from=build /vercel-test-app/package.json /vercel-test-app/package.json
COPY --from=build /vercel-test-app/tsconfig.build.json /vercel-test-app/tsconfig.build.json
COPY --from=build /vercel-test-app/dist /vercel-test-app/dist

EXPOSE 8008
CMD ["npm","run","start:prod"]