# [Physiobit](https://physiobit.seancornell.io)

Physiobit is a web application designed to help users collect, view, analyze, and download data from their Fitbit profiles. Aimed towards university and research use, Physiobit provides a user-friendly interface and robust data analysis tools to help researchers and scientists collect and analyze data more efficiently.

## Installation

To install Physiobit on your local machine, you will either need [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once installed, run the following commands:
```bash
git clone https://github.com/brandontranle/physiobit
cd physiobit
npm install
npm run build
```

This will install the necessary dependencies for the front end and build the project. The code will be generated in dist inside the physiobit folder.

To set up the API, run the following commands.
```bash
cd backend
npm install
npm run build
```

This will build the API. You then may want to move the built files to another location. For example:
```bash
mv dist /var/www/my-frontend-folder
mv backend/build /var/www/my-api-folder
```

## Configuration

To configure Physiobit on your local machine, read [CONFIG.md](CONFIG.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

Copyright © 2024 Physiobit Team

Code released under the [MIT License](LICENSE.md).