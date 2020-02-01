var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoSchema = new schema({
  
    userId : {type : String},
    currentAddress : {},
    PermenentAddress : {},
    created_at : {type : String}
    });
    
    module.exports = mongoose.model('partner_address' , mongoSchema , 'partner_address')