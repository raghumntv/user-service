const Mailjet = require('node-mailjet');

const sendOtpInEmail =async (email,name,otp)=>{
    const mailjet = Mailjet.apiConnect(process.env.MJ_API_KEY,process.env.MJ_SECRET_KEY);
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": process.env.FROM_EMAIL,
            "Name": "raghuGowda"
          },
          "To": [
            {
              "Email": email,
              "Name": name
            }
          ],
          "Subject": "Greetings from Raghu Gowda",
          "TextPart": "My first Mailjet email",
          "HTMLPart": `<h3>Dear User, welcome to One time code>${otp}</a>!</h3><br />May the force be with you!`,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
  return request
      .then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        throw new Error('something went wrong')
    })
}

module.exports ={sendOtpInEmail}