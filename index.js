const sgMail = require('@sendgrid/mail');

const sgAPIKey = ""; // api key from integration https://app.sendgrid.com/guide/integrate/langs/nodejs
const verfSender = ""; // verified sender email (no-reply@example.com usually)
const toEmail = "";

sgMail.setApiKey(sgAPIKey);

const msg = {
  to: toEmail,
  from: verfSender,
  subject: 'Test Email',
  text: 'This is the title',
  html: '<strong>fart</strong>',
};
sgMail.send(msg);