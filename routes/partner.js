var express = require('express');
var router = express.Router();
var multer = require('multer');
const mkdirp = require('mkdirp');
var dateFormat = require('date-and-time');
var now = new Date();
var date = dateFormat.format(now, 'DD-MM-YYYY')
var User = require('../models/partner');
var UserAddress = require('../models/partnerDetails/PartnerAddress');
var UserConformationDetails = require('../models/partnerDetails/PartnerConformationDetails');
var idProofTypes1 = require('../models/partnerIdProofTypes');
var genderType = require('../models/masterGender');
var arrayList = require('array-list')


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // http://54.157.52.31:4000/images/driver/1572851647124.jpg 
    const dir = './public/images';
    mkdirp(dir, err => cb(err, dir))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
});
var upload = multer({ storage });

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', upload.any(), (req, res) => {  
  //res.send({ IdType: req.body.IdType, IDImage: req.files,IDNumber: req.body.personalAddress.flatNo});
  User.findOne({ $and: [{ IDNumber: req.body.IDNumber }] }, async (err, document) => {
        if (err) { res.send(err) }
        else {
          //res.send({ IdType : document});
          /* type 0 --> admin (or) branch   type 1 ---> user */
          if (document) {
            res.json({ status: 401, message: 'ID already exists' })
          } else {
            
            var record = new User();
            record.IdType = req.body.IdType,
              record.IDImage = req.files[0].filename,
              record.IDNumber = req.body.IDNumber,
              record.UserName = req.body.UserName,
              record.AadharNumber = req.body.AadharNumber,
              record.Gender = req.body.Gender,
              record.DOB = req.body.DOB,
              record.so = req.body.so,
              record.created_at = date;
            //record.status = status,
              record.save(function (err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  // insert driverDocuments in driver_details Collection  
                    res.json({ status: 200, message: "User added successFully", id: doc._id})
                }
              })
          }
        }
      })
  });

  router.post('/addAddress', async (req, res) => {  
  //res.send({ IdType: req.body.IdType, IDImage: req.files,IDNumber: req.body.personalAddress.flatNo});
  if (req.body.id == "" || req.body.id == null){

  } else {
      User.findOne({ $and: [{ _id: req.body.id }] }, async (err, document) => {
        if (err) { res.send(err) }
        
        else {
          if (document) {
           var userAddressRecord = new UserAddress();
           userAddressRecord.userId = req.body.id,
           userAddressRecord.currentAddress = req.body.currentAddress,
           userAddressRecord.PermenentAddress = req.body.PermenentAddress,
           userAddressRecord.created_at = date;

           userAddressRecord.save(function (err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  res.json({ status: 200, message: "Address added successFully", id: doc._id})
                }
              })
          } else {

          }
        }
      })
    }
  });

  router.post('/userDetails', async (req, res) => {  
    //res.send({ IdType: req.body.IdType, IDImage: req.files,IDNumber: req.body.personalAddress.flatNo});
    if (req.body.id == "" || req.body.id == null) {
  
    } else {
        User.findOne({ $and: [{ _id: req.body.id }] }, async (err, document) => {
          if (err) { res.send(err) }
          
          else {
            if (document) {
             var userConformationDetails = new UserConformationDetails();
             userConformationDetails.userId = req.body.id,
             userConformationDetails.isCerification = req.body.isCerification,
             userConformationDetails.Qualification = req.body.Qualification,
             userConformationDetails.Experience = req.body.Experience,
             userConformationDetails.mobileNumber = req.body.mobileNumber,
             userConformationDetails.WhatsappNumber = req.body.WhatsappNumber,
             userConformationDetails.typeOfProfissianal = req.body.typeOfProfissianal,
             userConformationDetails.serviveArea = req.body.serviveArea,
             
             userConformationDetails.created_at = date;
  
             userConformationDetails.save(function (err, doc) {
                  if (err) {
                    res.send(err);
                  } else {
                    res.json({ status: 200, message: "Conformation details added successFully", id: doc._id})
                  }
                })
            } else {
  
            }
          }
        })
      }
    });

 router.get('/userList' , (req , res) =>{

  
  User.aggregate([
  
    {
    $project :{
      "_id": {
        "$toString": "$_id"
      },
      IDImage: 1,
      IDNumber: 1,
      UserName: 1,
      gender: 1,
      IdType: 1,
      AadharNumber: 1,
      DOB: 1,
      so: 1,
      created_at: 1,
      // userAddress : 1
    }

  },
  
  {
  
    $lookup:
         {
            from: "partner_address",
            localField: "_id",
            foreignField: "userId",
            as: "partnerAddress"
        },
      },
      {
  
        $lookup:
             {
                from: "partner_conformation_details",
                localField: "_id",
                foreignField: "userId",
                as: "partnerOtherDetails"
            },
          },

     { $project :{
        _id : 1,
        IDImage: 1,
        IDNumber: 1,
        UserName: 1,
        gender: 1,
        IdType: 1,
        AadharNumber: 1,
        DOB: 1,
        so: 1,
        created_at: 1,
        partnerAddress : 1,
        partnerOtherDetails : 1
      }
    }


] ,  (err , result) =>{
    res.send(result)
  })






 })


module.exports = router;
