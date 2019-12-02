const sgMail=require("@sendgrid/mail");
const config=require("config");

sgMail.setApiKey(config.get("sendGridApiKey"));

const sendApiKeyEmail=(email, name, apiKey)=>{
    sgMail.send({
        to:email,
        from:"johnpits85@gmail.com",
        subject:"Mountains Apikey",
        text:`Thank you ${name} for registering to our service .You can use this ${apiKey} to query the database`
    })

}

module.exports=sendApiKeyEmail