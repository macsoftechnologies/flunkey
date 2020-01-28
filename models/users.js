var mongoose = require('mongoose');


var schema = mongoose.Schema;
var usersSchema = new schema({
 
    name: {
        type: String,
       
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String
    },
    password : {
        type : String
    },
    deviceToken: {
        type: String
    },
    osType: {
        type: String
    },
    otp :{
        type:String
    },
  
    profilePic : {type : String},
    status : {type:String},
    created_at: { type: String},
    update_at :{type : String}

});

module.exports = mongoose.model('users' , usersSchema , 'users');