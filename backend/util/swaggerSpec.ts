import swaggerJSDoc from 'swagger-jsdoc';
import swaggerConfig from '../swaggerConf.json';

const swaggerSpec = swaggerJSDoc(swaggerConfig);
export default swaggerSpec;