# Redis Learning Projects

Small Node.js projects demonstrating Redis features through Express APIs. Each lesson is a separate npm project, so install dependencies from that lesson's `src` directory.

## Requirements

- Node.js 20 or later
- npm
- Docker Desktop with Docker Compose

## Start Redis and MongoDB

The root `docker-compose.yml` starts Redis on port `6379` and MongoDB on port `27017`. MongoDB is used by the local setup example; the other lessons use Redis.

From the repository root:

```sh
docker compose up -d
docker compose ps
```

To check Redis is responding:

```sh
docker exec -it chai-aur-redis redis-cli ping
```

The expected response is `PONG`.

To stop the services without deleting their stored data:

```sh
docker compose down
```

Docker Compose stores database data in named volumes. To stop the services and permanently remove those volumes, use `docker compose down -v`.

## Lessons

| Project | What it demonstrates | How to run |
| --- | --- | --- |
| [`2-setup-local-redis/src`](./2-setup-local-redis/src/) | Check Redis connectivity and connect to MongoDB | `npm run dev` |
| [`3-site-banner/src`](./3-site-banner/src/) | Store, retrieve, delete, and check a site banner in Redis | `npm run dev` |
| [`4-login-otp-ttl/src`](./4-login-otp-ttl/src/) | Store one-time codes with an expiration and verify them | `npm run dev` |
| [`5-user-profile-cache-json-vs-hash/src`](./5-user-profile-cache-json-vs-hash/src/) | Compare storing user profiles as JSON strings and Redis hashes | `npm run dev` |
| [`6-email-queue/src`](./6-email-queue/src/) | Build a simple email queue with Redis lists | `npm run dev` |
| [`07-order-confirmation-jobs-with-bullmq/src`](./07-order-confirmation-jobs-with-bullmq/src/) | Enqueue background jobs with BullMQ and process them with a worker | Run the API and worker separately |
| [`8-live-admin-notification-pubsub/src`](./8-live-admin-notification-pubsub/src/) | Publish Redis Pub/Sub notifications and listen for them | Run the API and subscriber separately |

## Run a lesson

Open a terminal in the selected lesson's `src` directory, install its dependencies, and start its entry point. For example:

```sh
cd 3-site-banner/src
npm install
node --watch index.js
```

Most API examples listen on `http://localhost:3000`. Start one API lesson at a time unless you change the port, because the examples share that default port.

For the local setup example, run `node index.js` from `2-setup-local-redis/src`.

For the BullMQ example, open two terminals in `07-order-confirmation-jobs-with-bullmq/src`:

```sh
npm install
node --watch api.js
```

```sh
node --watch worker.js
```

For the Pub/Sub example, open two terminals in `8-live-admin-notification-pubsub/src`:

```sh
npm install
node --watch api.js
```

```sh
node --watch subscriber.js
```

Set `REDIS_URL` if Redis is running somewhere other than `redis://localhost:6379`. The local setup project also accepts `MONGO_URI`; its default is `mongodb://localhost:27017/redis_db`.

## Example endpoints

Use a tool such as `curl`, Postman, or an API client to try the examples:

- **Site banner:** `GET`, `POST`, and `DELETE /banner`; `GET /banner/exist`. The POST body accepts JSON such as `{"content":"Hello!"}`.
- **OTP:** `POST /otp` with `{"phoneNumber":"5550100"}`, `POST /verify-otp` with the phone number and returned demo OTP, and `GET /otp/5550100/ttl`.
- **User profile:** `POST` and `GET /user/:id/json` or `/user/:id/hash`; send profile fields as JSON.
- **Email list queue:** `POST /emails` to enqueue a message and `GET /emails/process` to process one.
- **BullMQ:** `POST /welcome-email` with a JSON body such as `{"to":"learner@example.com","name":"Learner"}`.
- **Pub/Sub:** `POST /notification` with a JSON body such as `{"title":"A new notification"}`; watch the subscriber terminal for the message.

These are learning examples, not production-ready services. In particular, the OTP example returns the code in its response for demonstration; a real application should deliver it through a trusted messaging provider instead.
