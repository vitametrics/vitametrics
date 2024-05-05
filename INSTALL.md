# Installation

To install Vitametrics on your local machine, you will either need [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once installed, run the following commands:
```bash
git clone https://github.com/vitametrics/vitametrics
cd vitametrics
```

Once you have completed these steps, read [CONFIG.md](CONFIG.md)

After configuration, run the following command:
```bash
docker compose up --build

OR

docker compose up --build -d
```

This will build and start the docker containers for the Vitametrics application.


TODO: Add updating section here

## NGINX

If you are using NGINX, here is an example configuration.

```conf
server {
    listen 80;
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com;

    ssl_certificate /path/to/your/ssl/cert/site.pem;
    ssl_certificate_key /path/to/your/ssl/cert/site.key.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/ {
        proxy_pass http://localhost:7299/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

```