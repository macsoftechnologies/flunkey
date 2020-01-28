// var express = require('express')
// var router = express.Router();
// var Driver = require('../../models/driver')
var SNS = require('../../resources/aws.config');
 var generateOtp = require('otp-generator');
 var AWS = require('aws-sdk');
// var multer = require('multer');
// const mkdirp = require('mkdirp');

// var uploadLocation ;


var ObjectId = String;

 // Send Otp
module.exports.sendOtp = function (collectionName , id , mobileNumber, message ,res) { 
    
    var userOtp = generateOtp.generate(4, { upperCase: false, specialChars: false, alphabets: false });
    AWS.config.update(SNS);

   var sns = new AWS.SNS();
   sns.publish({
    Message:message +" "+ userOtp,
    Subject: 'flunkey',
    PhoneNumber: '+91' + mobileNumber
  }, function (awserror, result) {
    // console.log("result" , result)
    if (awserror) { res.send(awserror) }
    else {
      collectionName.updateOne({ _id: ObjectId(id) }, { $set: { "otp": userOtp } }, function (upErr, updateResp) {
        if (upErr) { res.send(upErr) }
        else {
          if (updateResp) {
      
             res.json({status : 200 , message: "OTP send sucessFully" , _id : id , mobileNumber : mobileNumber });
          }
        }
      })
      
    }
  })
};

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // console.log('uploadLocation' , uploadLocation);
//     console.log('userType' , req.params.id);
//     if(req.params.id == 0){
//       const dir = './public/images/admin'  ;
//       mkdirp(dir, err => cb(err, dir))
//     }else if (req.params.id == 1){
//       const dir = './public/images/user'  ;
//       mkdirp(dir, err => cb(err, dir))
//     }else{
//         if(req.params.id == 2){
//           const dir = './public/images/driver'  ;
//       mkdirp(dir, err => cb(err, dir))
//         }else if(req.params.id == 3){
//           const dir = './public/images/provider'  ;
//           mkdirp(dir, err => cb(err, dir))
//         }else{
//           const dir = './public/images/uploads'  ;
//           mkdirp(dir, err => cb(err, dir))
//         }
//     }
    
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+  '.jpg');
//   }
// });

// var upload = multer({ storage });



//  router.profilePic(collectionName , id , upload.single('profilePic') , (req , res) =>{
   
//   console.log("shared")
   

//  })
// router.post('/profilePic'  , (req , res)=> {
 
//   console.log("objectId" , req.body.objectId);
  
//   Driver.findOne({ _id: ObjectId(req.params.id) }, function (err, addRes) {
//     if(err) {res.send(err)}
//     else{
//       if(addRes){
//         upload.single("profilePic")
//       }else{
//         res.send(req.body.id);
//       }
//     }
    
//   })
     
//   console.log("file" , req.file);
//   console.log('_id' , req.body._id);
  

// });

// module.exports = router;
