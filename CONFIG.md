# Configuration

To get Vitametrics running, follow this guide on getting your instance configured.

## API

Run the following command:

```bash
cp .env.save .env
```

To get the Vitametrics API running on your local machine, you're going to have to edit some environment variables. Open up your .env file
in a text editor of your choosing.

By default, your ```.env``` will look like this:
```bash
{
    NODE_ENV='production'
    WEB_PORT='5173'
    API_PORT='7970'
    MONGODB_URI='mongodb://vitametrics:vitametrics@vitametrics-mongo:27017/vitametrics'
    FITBIT_CLIENT_ID='fitbitclientidhere'
    FITBIT_CLIENT_SECRET='fitbitclientsecrethere'
    BASE_URL='https://yoursite.com'
    REDIRECT_URI='https://yoursite.com/callback'
    SESSION_SECRET='sessionsecrethere'
    SENDGRID_API_KEY='apikeyhere'
    SENDGRID_FROM='sender@example.com'
    ADMIN_EMAIL='email@example.com'
}
```
### NODE_ENV

Should be ```production``` for a production setup.

### WEB_PORT

The port you'd like the frontend container to run on. Will default to ```5173```.

### API_PORT

The port you'd like the backend to run on. Will default to ```7970```.

### MONGODB_URI

The MongoDB URI for your database where you will be storing your data. Keep the default value if you do not want to use a different mongo database.

### FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET, REDIRECT_URI

To set up a new FitBit application and obtain a Client ID, Client Secret, and to set a Redirect URI, follow [this](https://dev.fitbit.com/apps) link. NOTE: Vitametrics cannot collect data if these values are not set. Ensure that your Redirect URI and URL's used in the FitBit Application Settings resolve. Additionally, Vitametrics requires intraday API access which can be applied for [here](https://dev.fitbit.com/build/reference/web-api/intraday/). 


### BASE_URL

The URL of your website.

### API_URL

The URL you'd like to have the API run on.

### SESSION_SECRET

A secure random string that will be used for user authentication.

### SENDGRID_API_KEY, SENDGRID_FROM

These can be configured if you would like to use [SendGrid](https://sendgrid.com) for email management.


### ADMIN_EMAIL

The email for the admin organization user (your email). This is the account that will receive login credentials once the instance is started.
