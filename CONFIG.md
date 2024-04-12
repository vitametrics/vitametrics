# Configuration

To get Physiobit running, follow this guide on getting your instance configured.

## API


To get the Physiobit API running on your local machine, you're going to have to edit some environment variables.

A sample ```.env``` might look like this:
```bash
{
    NODE_ENV='production'
    WEB_PORT='5173'
    API_PORT='7970'
    MONGODB_URI='mongodb://physiobit:physiobit@physiobit-mongo:27017/physiobit'
    FITBIT_CLIENT_ID=''
    FITBIT_CLIENT_SECRET=''
    BASE_URL='https://yoursite.com'
    REDIRECT_URI='https://yoursite.com/callback'
    SESSION_SECRET='SESSION_SECRET'
    ADMIN_TOKEN='ADMIN_TOKEN'
    SENDGRID_API_KEY=''
    SENDGRID_FROM=''
    ADMIN_EMAIL=''
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

To set up a new FitBit application and obtain a Client ID, Client Secret, and to set a Redirect URI, follow [this](https://dev.fitbit.com/apps) link. NOTE: Physiobit cannot collect data if these values are not set. Ensure that your Redirect URI and URL's used in the FitBit Application Settings resolve. Additionally, Physiobit requires intraday API access which can be applied for [here](https://dev.fitbit.com/build/reference/web-api/intraday/). 

Here is a sample FitBit Application setup:

![FitBit Application](https://github-production-user-asset-6210df.s3.amazonaws.com/46919543/298788468-b497abfe-91b8-4b2f-829d-02180860bb7d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240123%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240123T023842Z&X-Amz-Expires=300&X-Amz-Signature=17c965054b6e3fdda5f1b6920dc41732a0ffc27866fd62c6ac18ad49346f751b&X-Amz-SignedHeaders=host&actor_id=46919543&key_id=0&repo_id=628498661)


### BASE_URL

The URL of your website.

### SESSION_SECRET

A secure random string that will be used for user authentication.

### ADMIN_TOKEN

A secure random string that will be used for user creation.

### SENDGRID_API_KEY, SENDGRID_FROM

These can be configured if you would like to use [SendGrid](https://sendgrid.com) for email management.
