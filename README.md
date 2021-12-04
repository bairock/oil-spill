# Header 1
Server

1. Create server/uploads folder
```
cd server
```

2. Create .env config file in server/.env

```
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oil-spill?schema=public"
TOKEN_SECRET=tokensecret
USER_EMAIL=user@mail.ru
USER_PASSWORD=qwe123qwe
```

3. Install dependencies

```
yarn install
```

4. Run server

```
yarn start
```

# Header 1
ML Service


1. Install dependencies

```
cd yolov5 && yarn install
```

2. Install dependencies

```
pip install -r requirements.txt
```

3. Run server

```
node index.js