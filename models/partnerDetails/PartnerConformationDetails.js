var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoSchema = new schema({
    userId : {type : String},
    isCerification : {type : String},
    Qualification : {type : String},
    Experience : {type : String},
    mobileNumber : {type : String},
    WhatsappNumber : {type : String},
    typeOfProfissianal : {type : String},
    serviveArea : {type : String},
    created_at : {type : String}
    });
    
    module.exports = mongoose.model('partner_conformation_details' , mongoSchema , 'partner_conformation_details')