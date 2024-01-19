# fit-bit-application

A fitbit web application made to parse data from fitbit's WEB api


## Requirements
Before starting, fit-bit-application requires either of the following to run:
- [Node.js](https://nodejs.org/)
- [Yarn](https://formulae.brew.sh/formula/yarn)

## Installation

1. Clone this repository:

```bash
  git clone https://github.com/brandontranle/physiobit
```
2. Install dependencies:

```bash
  yarn install
```
3. Compile the TypeScript code:

```bash
  yarn tsc
```

## Running the Application

To start the application, run:
```bash
  yarn start
```

## API Flow

1. User sends a POST request to `/login` to authenticate. This is handled in [Login.ts](routes/Login.ts)
2. Once authenticated, the user has to retrieve their FitBit OAuth2 token to begin fetching devices/data. This is handled in [Auth.ts](routes/Auth.ts)
3. Once the user has a FitBit OAuth2 Token (and a refresh token), new device models will be created in the device collection in the database. These will hold device specific information and will be registered to the user. This is handeled in [fetchData.ts](util/fetchData.ts)
4. Users can logout by sending a GET request to `/logout` which will log them out.  

## TODO: 
- [X] User Login/Account Creation (admin only)
- [ ] Fetch Fitbit OAuth2 Token for users (testing)
- [ ] Data aggregation/download (testing)