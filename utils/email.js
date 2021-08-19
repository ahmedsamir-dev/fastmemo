const SendGridMail = require('@sendgrid/mail');

SendGridMail.setApiKey(
  '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'
);

async function sendPasswordResetMail(user, resetToken) {
  const msg = {
    to: user.email,
    from: 'fastmemoapp@gmail.com',
    subject: 'Reseting Password',
    text: `Your Reset Token Is: ${resetToken}`,
  };

  try {
    const mailResponse = await SendGridMail.send(msg);
    console.log('Email Sent Success');

    return mailResponse;
  } catch (err) {
    console.log('Email Not Sent', err.response.body);
  }
}

module.exports = sendPasswordResetMail;
