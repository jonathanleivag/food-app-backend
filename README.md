# Food App Backend

This is the backend service for a Fast Food Application. It's built with NestJS and provides the API endpoints for both mobile and web applications.

## Related Projects

- 📱 Mobile App: [Food App Mobile](https://github.com/jonathanleivag/foodapp)
- 🖥️ Web App: [Food App Web](https://github.com/jonathanleivag/food_app_web)

## Prerequisites

- Node.js
- MongoDB
- Pusher Account
- MercadoPago Account

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

## Project setup

```bash
$ npm install
cp .env.example .env
# MongoDB
URI_MONGO=your_mongodb_uri

# Pusher
APP_ID_PUSHER=your_app_id
KEY_PUSHER=your_key
SECRET_PUSHER=your_secret
CLUSTER_PUSHER=your_cluster

# JWT
JWT_SECRET=your_jwt_secret

# MercadoPago
PUBLIC_KEY_MERCADOPAGO=your_public_key
ACCESS_TOKEN_MERCADOPAGO=your_access_token
CLIENT_ID_MERCADOPAGO=your_client_id
CLIENT_SECRET_MERCADOPAGO=your_client_secret

# API URL
URL_API=your_api_url

# Email
EMAIL=your_email

npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
