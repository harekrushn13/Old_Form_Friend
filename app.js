require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const { google } = require('googleapis');
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { isSet } = require('util/types');
const nodeCache = require("node-cache");
const myCache = new nodeCache();
const jwt = require("jsonwebtoken");

app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true});
const login_details_schema= new mongoose.Schema(
    {
        email: String,
        username: String,
        refresh_token: String,
        forms:[
            { 
                form_id: String,
                form_link : String,
                date:String,
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

//This is login page
app.get('/', function (req, res) {
    if(req.cookies.refresh_token)
    {
        oauth2Client.setCredentials({
            refresh_token : req.cookies.refresh_token
        })
        res.redirect("/datataker");
    }
    else
    {
        res.redirect("/home");
    }
});

//This is redirect to login
app.get("/login", function(req,res){
    res.redirect(authorizationUrl);
});






//Google callback
app.get("/auth/google/secrets", function(req, res){
    let errorFlag = 0;
    async function run1() {
        try {
            let q = url.parse(req.url, true).query;
            let { tokens } = await oauth2Client.getToken(q.code);
            oauth2Client.setCredentials(tokens);
            userCredential = tokens;
        }
        catch (error)
        {
            errorFlag = 1;
        }
    }
    run1().then(()=>{
        if(errorFlag)
        {
            myCache.set("errors", "line 126");
            res.redirect("/");
        }
        else
        {
            res.redirect("/datataker");
        }
    });
});







//Take google profile data, create refresh token cookie
app.get("/datataker", function(req,res){
    let userData = {
        email : null,
        userName : null,
        profilePicture : null
    };
    try {
        res.cookie("refresh_token", oauth2Client.credentials.refresh_token, {maxAge : 172800000 /*2days*/ });
    } catch (error) {
        myCache.set("errors", "line 152");
        res.redirect("/");
    }
    let Oauth2 = google.oauth2({
        auth : oauth2Client,
        version : "v2"
    });
    async function run() {
        try{
            data = await Oauth2.userinfo.get();
            userData.email = data.data.email;
            userData.userName = data.data.name;
            userData.profilePicture = data.data.picture;
            let token = jwt.sign(userData,process.env.SECRET);
            res.cookie("jwttoken", token);
        }
        catch(error)
        {
            await res.clearCookie("refresh_token");
            myCache.set("errors", "line 171");
            res.redirect("/");
        }
    }
    run().then(()=>{
        console.log(oauth2Client.credentials.refresh_token);
        res.redirect('/home');
    });
});






//Main page
app.get("/home", function(req, res){
    let userData = {
        email : null,
        userName : null,
        profilePicture : null
    };
    let UserError = null;
    if(myCache.has("errors"))
    {
        UserError = myCache.take("errors");
    }
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    res.render("index", {userData : userData, UserError : UserError});
});






//Forms page
app.get("/forms", function(req,res){
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        myCache.set("errors", "There was an error");
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    let mail=userData.email;
    let formsData = null;
    let formID = [];
    const forms = google.forms({
        version: 'v1',
        auth: oauth2Client,
    });
    async function run1()
    {
        let docs = await Login_Details.find({email:{$eq:mail}},{_id:0,email:0,forms:{deadline:0,last_remainder:0,_id:0}}).sort({date:-1});
        if(docs.length == 0)
        {
            myCache.set("errors", "There was an error");
        }
        else
        {
            formsData = docs[0].forms;
            console.log(formsData);
        }
    }
    
    
    //this is new
    
    
    async function run2(){
        let flength = formID.length;
        for(let countv = 0; countv<flength ; countv++)
        {
            let element = formID[countv];
            // if(myCache.has(element))
            // {
            //     console.log("yes");
            //     continue;
            // }
            let filledenrolls = [];
            let allenrolls = [];
            let metadata = null;
            let formdata = null;
            let enrollquestionid = null;
            var Batch_data=[];
    
    
    
    
    
            //Taking batch data
            let docs = await Login_Details.find({email:{$eq:mail}});
            var n=docs[0].forms.length;
            for(var i=0;i<n;i++)
            {
                if(docs[0].forms[i].form_id==element)
                {
                    var m=docs[0].forms[i].Batches.length;
                    for(var j=0;j<m;j++)
                    {
                        Batch_data.push(docs[0].forms[i].Batches[j].batch);
                    }
                }
            }
        
        
        
        
        
        
            //taking all batches data in allenrolls array
            let totalBatches = Batch_data.length;
            for(let count = 0;count<totalBatches;count++)
            {
                let batchno = Batch_data[count];
                let docs2 = await Batches.find({batch:{$eq:batchno}});
                let no_document=docs2[0].details.length;
                for(var i=0;i<no_document;i++)
                {
                    allenrolls.push(
                    {   
                        enroll : docs2[0].details[i].Enrollment,
                        name : docs2[0].details[i].Name,
                        email : docs2[0].details[i].Email ,
                        status : 0,
                        batch : "IT_" + batchno,
                        responseId : null
                    });
                }
            }
    
    
    
    
    
    
            //taking response from google
            try {
                metadata = await forms.forms.get({
                    formId: element,
                });
                formdata = await forms.forms.responses.list({
                    formId: element,
                });
                // console.log(metadata);
                metadata.data.items.forEach((item) => {
                    if (item.title == 'EnrollmentNo') {
                        enrollquestionid = item.questionItem.question.questionId;
                    }
                });
                
                if(Object.keys(formdata.data).length != 0)
                {
                    formdata.data.responses.forEach((response) => {
                        filledenrolls.push(
                            {
                                enroll : response.answers[enrollquestionid].textAnswers.answers[0].value,
                            email : null,
                            status : 1,
                            name : null,
                            responseId : response.responseId
                        });
                    });
                }
                myCache.set("responses" + element,formdata.data)
                myCache.set("metadata" + element,metadata.data)
                // console.log(filledenrolls);
            } catch (error) {
                console.log(error);
                res.redirect("/");
            }
    
    
            //function to set status to 1
            filledenrolls.forEach(enrollment =>{
                let flag = 0;
                for(let i=0; i< allenrolls.length ; i++)
                {
                    if(allenrolls[i].enroll == enrollment.enroll)
                    {
                        flag=1;
                        allenrolls[i].status = 1;
                        allenrolls[i].responseId = enrollment.responseId;
                    }
                }
                if(!flag)
                {
                    allenrolls.push(enrollment);
                }
            });
            myCache.set(element,allenrolls,300);
        }
    }
    run1().then(async()=>{
        if(formsData == null)
        {
            myCache.set("errors", "There was an error");
            res.redirect("/");
            return;
        }
        formsData.forEach(ele=>{
            formID.push(ele.form_id);
        });
        
        await run2();
        let UserError = null;
        let count = [];
        let i =0;
        formID.forEach(element=>{
            count.push({formid : element,filled:0,unfilled:0});
            let allenrolls = myCache.get(element);
            allenrolls.forEach(enrolls=>{
                if(enrolls.status == 1)
                {
                    count[i].filled += 1;
                }
                else
                {
                    count[i].unfilled += 1;
                }
            })
            i++;
        })
        console.log(count);
        if(myCache.has("errors"))
        {
            UserError = myCache.take("errors");
        }
        res.render("forms", {formsData : formsData , userData : userData, UserError : UserError, count : count});
    })
});





//Responses Page
app.get("/form/:formID/:abs", function(req, res){
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        myCache.set("errors", "There was an error");
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    let formID = req.params.formID;
    if(!(myCache.has(formID)))
    {
        let errors = "Timeout";
        myCache.set("errors", errors);
        res.redirect("/forms");
    }
    var Batch_data=[];
    var mail=userData.email;
    let currentform = {
        formtitle : null,
        deadline : null,
        formlink : null
    };
    async function run4(){
        //to get form details
        let docs = await Login_Details.find({email:{$eq:userData.email}})
        let n=docs[0].forms.length;
        for(var i=0;i<n;i++)
        {
            if(docs[0].forms[i].form_id==formID)
            {
                currentform.formtitle=docs[0].forms[i].title;
                currentform.deadline=docs[0].forms[i].deadline;
                currentform.formlink=docs[0].forms[i].form_link;
            }
        }
    }
    async function run5(){
        //Taking batch data
        let docs = await Login_Details.find({email:{$eq:userData.email}});
        var n=docs[0].forms.length;
        for(var i=0;i<n;i++)
        {
            if(docs[0].forms[i].form_id==formID)
            {
                var m=docs[0].forms[i].Batches.length;
                for(var j=0;j<m;j++)
                {
                    Batch_data.push(docs[0].forms[i].Batches[j].batch);
                }
            }
        }
    }
    run4().then(async()=>{
        let abs = req.params.abs;
        let UserError = null;
        if(myCache.has("errors"))
        {
            UserError = myCache.take("errors");
        }
        res.render("status", {userData : userData, allenrolls : myCache.get(formID), abs : abs, formID : formID, currentform : currentform, batches : Batch_data, UserError : UserError});
    });
});

app.post("/formstatus", function(req,res)
{
    let abs = req.body.filter;
    let formID = req.body.formID;
    res.redirect("/form/" + formID + "/" + abs);
});





app.post("/create" , function(req,res)
{
    let formdetails = {
        title : null,
        formID : null,
        formLink : null
    };
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    let errors = null;
    formdetails.formID = req.body.formID;
    try {
        let q = url.parse(formdetails.formID, true);
        let p = path.parse(q.pathname);
        p = path.parse(p.dir);
        formdetails.formID = p.name;
    }
    catch(error)
    {
        errors = "Invalid Url";
    }
    console.log(formdetails.formID);
    const forms = google.forms({
        version: 'v1',
        auth: oauth2Client,
    });
    async function run1()
    {
        try
        {
            const metadata = await forms.forms.get({
                formId: formdetails.formID,
            });
            
            docs = await Login_Details.find({email:{$eq:userData.email}});
            formdetails.title = metadata.data.info.title;
            formdetails.formLink = metadata.data.responderUri;
            if(docs.length > 0)
            {
                var n=docs[0].forms.length;
                for(let i=0;i<n;i++)
                {
                    if(docs[0].forms[i].form_id==formdetails.formID)
                    {
    
                        errors="Form already exists";
                    }
                }
            }
        }
        catch(error)
        {
            console.log(error);
            errors = "There was some error please try again";
        }
    }
    run1().then(()=>{
        myCache.set("errors", errors);
        if(errors == null)
        {
            myCache.set("formdetails",formdetails);
            res.redirect("/addform");
        }
        else
            res.redirect("/home");
    })
});



app.get("/addform", function(req,res){
    if(!myCache.has("formdetails"))
    {
        myCache.set("errors", "line 570");
        res.redirect("/");
        return;
    }
    let formdetails = myCache.get("formdetails");
    if(formdetails.title == null || formdetails.formID == null)
    {
        res.redirect("/home");
    }
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    //to get number of batches
    let No_Batch = [];
    async function run1(){
        let data = await Batches.find();
        var no=data.length;
        for(var i=0;i<no;i++)
        {
            No_Batch[i]=data[i].batch;
        }
    }
    run1().then(()=>{
        // console.log(No_Batch);
        let UserError = null;
        if(myCache.has("errors"))
        {
            UserError = myCache.take("errors");
        }
        res.render("addform", {userData : userData, formdetails : formdetails , batches : No_Batch, UserError : UserError});
    })
});

app.post("/createform", function(req,res){
    if(!myCache.has("formdetails"))
    {
        myCache.set("errors", "line 614");
        res.redirect("/");
        return;
    }
    let formdetails = myCache.get("formdetails");
    if(formdetails.title == null || formdetails.formID == null)
    {
        res.redirect("/home");
    }
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    if(formdetails.title == null || formdetails.formID == null)
    {
        res.redirect("/home");
    }
    let remmethod = req.body.remmethod;
    let deadline = req.body.deadline;
    let allbatches = req.body.batches;
    let abatches = [];
    allbatches.forEach(element => {
        abatches.push({batch : element});
    })
    // console.log(abatches);
    Login_Details.find({email:{$eq:userData.email}}).then(function(docs)
    {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let final_date = year + "-" + month + "-" + date;
        if(docs.length==0)
        {
            const login=new Login_Details(
                {
                    email: userData.email,
                    username: userData.userName,
                    refresh_token: oauth2Client.credentials.refresh_token,
                    forms:[
                        {
                            form_id: formdetails.formID,
                            form_link: formdetails.formLink,
                            title: formdetails.title,
                            deadline: null,
                            date:final_date,
                            last_remainder: null,
                            Batches:abatches,
                        }
                    ]
                }
            )
            login.save();
        }
        else
        {
            docs[0].forms.push(
                {
                    form_id:formdetails.formID,
                    form_link:formdetails.formLink,
                    deadline:null,
                    date:final_date,
                    title:formdetails.title,
                    last_remainder:null,
                    Batches:abatches
                }
            )
            docs[0].save();
        }
        res.redirect("/");
    });

});





//sendmails
app.get("/sendmails/:formID", function(req,res){
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    const gmail = google.gmail({
        version : 'v1',
        auth : oauth2Client
    });
    let formID = req.params.formID;
    if(!(myCache.has(formID)))
    {
        res.redirect("/forms");
    }
    let allenrolls = myCache.get(formID);
    let mailstosend = [];
    allenrolls.forEach(element=>{
        if(element.status == 0)
        mailstosend.push("<" + element.email + ">");
    });
    const subject = 'Reminder to fill form';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    let tomails = "To: ";
    mailstosend.forEach(element=>{
        tomails += element + ",";
    })
    tomails.slice(0,-1);
    const messageParts = [
        'From: VGEC <' + userData.email + ">",
    ];
    messageParts.push(tomails);
    messageParts.push('Content-Type: text/html; charset=utf-8');
    messageParts.push('MIME-Version: 1.0');
    messageParts.push(`Subject: ${utf8Subject}`);
    messageParts.push('');
    messageParts.push('This is a message to tell you that you are hacked');
    messageParts.push('So... <b>Get Doomed Hahahaha!</b>  🤘❤️😎');
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    async function run1(){
        const res = await gmail.users.messages.send({
            userId: 'avcthehero@gmail.com',
            requestBody: {
            raw: encodedMessage,
            },
        });
        console.log(res.data);
    }
    run1().then(()=>{
        res.redirect("/forms");
    })
});

app.get("/response/:responseId/:formId", (req,res)=>{
    let userData = null;
    if(req.cookies.jwttoken)
    {
        userData = jwt.verify(req.cookies.jwttoken,process.env.SECRET);
    }
    else
    {
        res.clearCookie("refresh_token");
        res.redirect("/");
        return;
    }
    let formId = req.params.formId;
    let responseId = req.params.responseId;
    if(!(myCache.has(formId) && myCache.has("metadata"+formId) && myCache.has("responses"+formId)))
    {
        res.redirect("/forms");
        return;
    }
    let questions = [];
    let allenrolls = myCache.get(formId);
    let metadata = myCache.get("metadata" + formId);
    let formdata = myCache.get("responses" + formId);
    metadata.items.forEach(item=>{
        questions.push({
            title : item.title,
            questionId : item.questionItem.question.questionId,
            answer : null
        });
    });
    questions.forEach(question=>{
        formdata.responses.forEach((response) => {
            if(responseId == response.responseId)
            {
                question.answer = response.answers[question.questionId].textAnswers.answers[0].value; 
            }
        });
    });
    let resdata = allenrolls.find(ele => ele.responseId == responseId);
    res.render("response", {userData : userData, resdata : resdata, questions : questions, formlink : metadata.responderUri, formtitle : metadata.info.title, UserError:null});
    console.log(questions);
})



app.get("/logout", function(req,res){
    res.clearCookie("refresh_token");
    res.clearCookie("jwttoken");
    res.redirect("/");
})
app.listen(3000, ()=>{
    console.log("App started at port 3000");
})