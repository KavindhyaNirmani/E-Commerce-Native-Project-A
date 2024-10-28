const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,   
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.sendFeedback=async(req,res)=>{
    try{
        const { name, email, contactNumber, message } = req.body;
        
        const mailOptions = {
            from: email,
            to: 'yumzyfooddealer@gmail.com',
            subject: `Feedback from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nContact Number: ${contactNumber}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);
        resizeBy.status(200).json({
            message:'Feedback sent successfully!'
        });
        
    }catch(error){
        console.error('Error sending feedback',error);
        res.status(500).json({
            error:'Failed to send feedback'
        });
    }
};