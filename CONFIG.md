# Configuration

To get Physiobit running, follow this guide on getting your instance configured.

## API


To get the Physiobit API running on your local machine, you're going to have to edit some environment variables.

A sample ```.env``` might look like this:
```bash
{
    NODE_ENV='dev'
    PORT='7970'
    PROD_DB_URI='mongodb://192.168.1.101:32770/fitbit-prod'
    FITBIT_CLIENT_ID='23RMDW'
    FITBIT_CLIENT_SECRET='1cce030af27a881068f790aa75e7ebbb'
    BASE_URL='https://physiobit.seancornell.io'
    REDIRECT_URI='https://physiobit.seancornell.io/api/callback'
    JWT_SECRET='RR7W48RGSUZ4EEKPEKJHTRPEL9'
    ADMIN_TOKEN='XUQ4LULL!R6^HJQZ$MA9#AFZY%JNV3GXZYW3'
}
```
### NODE_ENV

Should be ```production``` for a production setup.

### PORT

Set to the desired port for the API. Defaults to ```3000```.

### PROD_DB_URI

The MongoDB URI for your database where you will be storing production data.

### FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET, REDIRECT_URI

To set up a new FitBit application and obtain a Client ID, Client Secret, and to set a Redirect URI, follow [this](https://dev.fitbit.com/apps) link. NOTE: Physiobit cannot collect data if these values are not set. Ensure that your Redirect URI and URL's used in the FitBit Application Settings resolve.

Here is a sample FitBit Application setup:

![FitBit Application](https://github-production-user-asset-6210df.s3.amazonaws.com/46919543/298788468-b497abfe-91b8-4b2f-829d-02180860bb7d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240123%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240123T023842Z&X-Amz-Expires=300&X-Amz-Signature=17c965054b6e3fdda5f1b6920dc41732a0ffc27866fd62c6ac18ad49346f751b&X-Amz-SignedHeaders=host&actor_id=46919543&key_id=0&repo_id=628498661)

### BASE_URL

The URL of your website.

### JWT_SECRET

A secure random string that will be used for user authentication.

### ADMIN_TOKEN

A secure random string that will be used for user creation.