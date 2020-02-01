var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoShema = new schema({
    _id : {type : String},
    type : {type : String}
    });
    
    module.exports = mongoose.model('mast_gender' , mongoShema , 'mast_gender')