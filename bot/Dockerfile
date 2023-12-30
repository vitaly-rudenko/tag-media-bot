FROM denoland/deno:alpine-1.39.1

WORKDIR /app

COPY . .

RUN deno cache app.ts

USER deno

EXPOSE 3000

CMD ["run", "--allow-net", "--allow-env", "app.ts"]
