import nodemailer from 'nodemailer'
import { html } from './user.email.html.js';
import jwt from  'jsonwebtoken'

export const sendEmail =async (options)=>{
    
let transporter = nodemailer.createTransport({
    service:'gmail',
       auth: {
         user: 'mostafamahmoudmorcy@gmail.com', // generated ethereal user
         pass: "idxpietzrekdibsr", // generated ethereal password // pass وهمى
       },
     });
   
     let token=jwt.sign({email:options.email},'mostafa22')
     // send mail with defined transport object
     let info = await transporter.sendMail({
       from: '"Mostafa Mo 👻" <mostafamahmoudmorcy@gmail.com>', // sender address
       to: options.email, // list of receivers
       subject: "Confirm your Email✔", // Subject line
       html:html(token), // html body
     });
     console.log(info);
}



export const sendConfirmation =async (email,subject,html)=>{
    
  let transporter = nodemailer.createTransport({
      service:'gmail',
         auth: {
           user: 'mostafamahmoudmorcy@gmail.com', // generated ethereal user
           pass: "idxpietzrekdibsr", // generated ethereal password // pass وهمى
         },
       });
       // send mail with defined transport object
       let info = await transporter.sendMail({
         from: '"Mostafa Mo 👻" <mostafamahmoudmorcy@gmail.com>', // sender address
         to:email, // list of receivers
         subject, // Subject line
         html, // html body
       });
       console.log(info);
  }
  