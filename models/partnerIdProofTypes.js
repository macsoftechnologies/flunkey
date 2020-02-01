var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoShema = new schema({
    _id : {type : String},
    type : {type : String}
    });
    
    module.exports = mongoose.model('partner_id_proof_types' , mongoShema , 'partner_id_proof_types')