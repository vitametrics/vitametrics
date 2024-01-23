# Installation

To install Physiobit on your local machine, you will either need [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once installed, run the following commands:
```bash
git clone https://github.com/brandontranle/physiobit
cd physiobit
npm install
```

This will install the necessary dependencies for the front end.

To set up the API, run the following commands.
```bash
cd backend
npm install
```

Once you have completed these steps, read [CONFIG.md](CONFIG.md)

Now that you've configured Physiobit, you're ready to build the application.

To build Physiobit, run the following commands:
```bash
cd /path/to/physiobit
npm run build
```
To build the API, run these commands:
```bash
cd /path/to/physiobit/backend
npm run build
```

This will build both the frontend and backend. You may want to move
these folders to a different directory. For example:
```bash
mv /path/to/physiobit/dist /var/www/physiobit-frontend
mv /path/to/physiobit/backend/build /var/www/physiobit-backend
```

To serve Physiobit, you can use something like [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/):

```bash
pm2 start --name physiobit-api /path/to/physiobit/api/build/index.js
pm2 save // ensures that the API will restart if server is stopped
```

## NGINX

If you are using NGINX, here is an example configuration.

```conf
server {
    listen 80;
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /path/to/your/ssl/certificate.pem;
    ssl_certificate_key /path/to/your/ssl/certificate.key.pem;

    location / {
        root /path/to/physiobit/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:7970; // change to PORT from API .env
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```