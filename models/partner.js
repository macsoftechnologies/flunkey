var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoSchema = new schema({
  
    IDImage : {},
    IdType : {type : String},
    IDNumber : {type : String},
    UserName : {type : String},
    AadharNumber : {type : String},
    Gender : {type : String},
    DOB : {type : String},
    so : {type : String},
    created_at : {type : String}
    });
    
    module.exports = mongoose.model('paratner_details' , mongoSchema , 'paratner_details')