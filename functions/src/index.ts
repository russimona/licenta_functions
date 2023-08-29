/* eslint-disable @typescript-eslint/no-var-requires */
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cors = require("cors")({origin: true});
const functions = require("firebase-functions");

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    "996283414065-47su8olah3leefnl9m6a1stkc37ldc33.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
  );


  oauth2Client.setCredentials({
    // eslint-disable-next-line max-len
    refresh_token: "1//043-nZ3QTs6O4CgYIARAAGAQSNwF-L9Ir_OGg8kA8f9T1SiBLpV-6KTWgSWbLGkeG5lfixzVSfhw0iOwTMF4YxPowG89mj2sRvVc",
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err: Error, token: any) => {
      if (err) {
        console.log(err);
        throw new Error("fail :(");
      }
      console.log("token", token);
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "workease707@gmail.com",
      accessToken,
      // eslint-disable-next-line max-len
      clientId: "996283414065-47su8olah3leefnl9m6a1stkc37ldc33.apps.googleusercontent.com",
      // eslint-disable-next-line max-len
      clientSecret: "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",
      // eslint-disable-next-line max-len
      refreshToken: "1//043-nZ3QTs6O4CgYIARAAGAQSNwF-L9Ir_OGg8kA8f9T1SiBLpV-6KTWgSWbLGkeG5lfixzVSfhw0iOwTMF4YxPowG89mj2sRvVc",
    },
  });

  return transporter;
};

const sendEmail = async (emailOptions: any) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

exports.sendMail = functions.https.onRequest((req: any, res: any) => {
  cors(req, res, () => {
    const subject = req.query.subject;
    const to = req.query.to;
    const text = req.query.text;
    return sendEmail({
      subject: subject,
      text: text,
      to: to,
      from: "workease707@gmail.com",
    }).then(()=>{
      res.status(200).json({message: "Email sent successfully"});
    });
  });
});
