const { google } = require('googleapis');
const cron = require("node-cron");
require("dotenv").config();
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/forms.body',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/forms.body.readonly',
    'https://www.googleapis.com/auth/forms.responses.readonly',
    'https://mail.google.com/'
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
});
const mongoose = require('mongoose');
mongoose.connect("mongodb://0.0.0.0:27017/Form_Friend",{useNewUrlParser:true});
const login_details_schema= new mongoose.Schema(
    {
        email: String,
        username: String,
        refresh_token: String,
        forms:[
            { 
                form_id: String,
                form_link : String,
                title: String,
                deadline: String,
                last_remainder: String,
                Batches: [{batch:String}]
            }],
    },{ timestamps: true }
);
const Login_Details=mongoose.model("Login_Detail",login_details_schema);


const batchschema = new mongoose.Schema(
    {
        batch: String,
        details:[
            {
                Enrollment: String,
                Name: String,
                Email: String
            }
        ]
    }
);
const Batches=mongoose.model("Batches",batchschema);
async function run1(){
    let docs = await Login_Details.find({});
    let noOfUsers = docs.length;
    for(let i=0;i<noOfUsers;i++)
    {
        let element = docs[i];
        oauth2Client.setCredentials({
        refresh_token : element.refresh_token
        });
        const forms = google.forms({
            version: 'v1',
            auth: oauth2Client,
        });
        let Oauth2 = google.oauth2({
            auth : oauth2Client,
            version : "v2"
        });
        const gmail = google.gmail({
            version : 'v1',
            auth : oauth2Client
        });
        let data = await Oauth2.userinfo.get();    
        let noOfForms = element.forms.length;
        for(let j=0;j<noOfForms;j++)
        {
            let formdata = element.forms[j];
            let allenrolls = [];
            let filledenrolls = [];
            let batches = [];
            let noOfBatches = formdata.Batches.length;
            let metadata = null;
            let formdatagoogle = null;
            for(let k=0;k<noOfBatches;k++)
            {
                let batch = formdata.Batches[k].batch;
                batches.push(batch);
                let dbget = await Batches.find({batch:{$eq:batch}});
                dbget[0].details.forEach(detail=>{
                    allenrolls.push({
                        enroll : detail.Enrollment,
                        email : detail.Email,
                        status : 0
                    });
                });
            }



            try {
                metadata = await forms.forms.get({
                    formId: formdata.form_id,
                });
                formdatagoogle = await forms.forms.responses.list({
                    formId: formdata.form_id,
                });
                // console.log(metadata);
                metadata.data.items.forEach((item) => {
                    if (item.title == 'EnrollmentNo') {
                        enrollquestionid = item.questionItem.question.questionId;
                    }
                });
                
                if(Object.keys(formdatagoogle.data).length != 0)
                {
                    formdatagoogle.data.responses.forEach((response) => {
                        filledenrolls.push(
                        {
                            enroll : response.answers[enrollquestionid].textAnswers.answers[0].value,
                            email : null,
                            status : 1,
                        });
                    });
                }
            }
            catch (error) {
                continue;
            }

            filledenrolls.forEach(enrollment =>{
                for(let l=0; l< allenrolls.length ; l++)
                {
                    if(allenrolls[l].enroll == enrollment.enroll)
                    {
                        allenrolls[l].status = 1;
                    }
                }
            });

            let tomails = "To: ";
            allenrolls.forEach(enrollment=>{
                if(enrollment.status == 0)
                {
                    tomails += "<" + enrollment.email + ">,";
                }
            })
            tomails.slice(0,-1);
            let subject = 'hello' + name;
            let utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
            let messageParts = [
                'From: VGEC <' + data.data.email + ">",
            ];
            messageParts.push(tomails);
            messageParts.push('Content-Type: text/html; charset=utf-8');
            messageParts.push('MIME-Version: 1.0');
            messageParts.push(`Subject: ${utf8Subject}`);
            messageParts.push('');
            messageParts.push('This is a message to remind you to fill this form');
            messageParts.push("<a href='" + formdata.form_link + "'>This is link</a>");
            let message = messageParts.join('\n');
            console.log(message);

            // The body needs to be base64url encoded.
            let encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            
            try {
                let res = await gmail.users.messages.send({
                    userId: 'avcthehero@gmail.com',
                    requestBody: {
                    raw: encodedMessage,
                    },
                });
            }
            catch(error){
                continue;
            }
            console.log("message sent");
        }
    }
}
cron.schedule("* */2 * * * *", async()=>{
    await run1();
})