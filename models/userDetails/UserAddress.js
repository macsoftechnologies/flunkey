var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userDetailsSchema = new schema({
  
    userId : {type : String},
    currentAddress : {},
    PermenentAddress : {},
    created_at : {type : String}
    });
    
    module.exports = mongoose.model('user_address' , userDetailsSchema , 'user_address')