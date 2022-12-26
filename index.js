import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config();
// import * as sdk from 'cloudcs/sdk'
import aws from 'aws-sdk'
const getTransporter = async(config) => {
    console.log('checkedd',config)
  return nodemailer.createTransport(config)
}

 export const sendMail = async (
  workspace,
  from,
  to,
  template,
  subject,
  inReplyTo = null,
  attachments
) => {
  let config = null
    config = {
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        accessKeyId: process.env.sesApiKey,
        secretAccessKey: process.env.sesApiSecret,
        region: process.env.sesRegion,
        paramValidation: false
      })
    }

//   const emails = await bp.database('email_settings').where('workspace', '=', workspace)

//   const found = emails && emails.filter(e => e.cloudcs_email == from, e.original_email == from)
//   if (transporterType == 'smtp') {
//     if (found && found.length > 0 && found[0]) {
//       config = {
//         ...found[0].cloudcs_smtp,
//         auth: {
//           user: found[0].cloudcs_email,
//           pass: process.env.EMAIL_PASSWORD
//         }
//       }
//     }
//   }
  const transporter = await getTransporter(config);

    return transporter.sendMail({
    priority: 'high',
    from: `Support <info@tpasc.ca>`,
    to:"sabinadhikari24@gmail.com",
    subject:"Test ignore",
    html:"<b>Hello world?</b",
    replyTo: from,
    ...(attachments && attachments.length > 0 && { attachments }),
    ...(inReplyTo && { inReplyTo })
  })
}
const test = async() => {
    const res = await sendMail();
    console.log("responsee",res);
}
console.log('testingggg',test())