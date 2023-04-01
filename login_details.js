const mongoose = require('mongoose');
mongoose.connect("mongodb://0.0.0.0:27017/Form_Friend",{useNewUrlParser:true});

const login_details_schema= new mongoose.Schema(
    {
        email: String,
        username: String,
        forms:[
            { 
                form_id: String,
                title: String,
                deadline: String,
                last_remainder: String,
                Batches: [{batch:String}]
            }],
    },{ timestamps: true }
)

const Login_Details=mongoose.model("Login_Detail",login_details_schema);

// <----add data to database----->


// const login=new Login_Details(
//     {
//         email:"ayushchauhan2526@gmail.com",
//         username:"Ayush Chauhan",
//         forms:[
//             {
//                 form_id:"kdajksdkasd",
//                 title:"Un-titled",
//                 deadline:"30/2/2022",
//                 last_remainder:"31/3/2023",
//                 Batches:[
//                     {
//                         batch:"Batch_2021"
//                     },
//                     {
//                         batch:"Batch_2022"
//                     }
//                 ]
//             },
//             {
//                 form_id:"kdajksdkasd",
//                 title:"Un-titled",
//                 deadline:"30/2/2022",
//                 last_remainder:"31/3/2023",
//                 Batches:[
//                     {
//                         batch:"Batch_2021"
//                     },
//                     {
//                         batch:"Batch_2022"
//                     }
//                 ]
//             }
//         ]
//     }
// )
// login.save();

var mail="ayushchauhan2526@gmail.com";

Login_Details.find({email:{$eq:mail}},{_id:0,email:0,forms:{deadline:0,last_remainder:0,Batches:0,_id:0}}).then(function(docs){

// var objw = JSON.parse(docs);
console.log(JSON.stringify(docs));
console.log(docs[0].forms[1].title);    
});