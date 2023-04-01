const mongoose = require('mongoose');
mongoose.connect("mongodb://0.0.0.0:27017/Form_Friend",{useNewUrlParser:true});
const login_details_schema= new mongoose.Schema(
    {
        email: String,
        username: String,
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
module.export = {
    mongoose,login_details_schema,Login_Details,batchschema,Batches
}