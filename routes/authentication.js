var express = require('express');
var router = express.Router();
var User = require('../models/users');
var generateOtp = require('otp-generator');
var Email = require('nodemailer');
var bcrypt = require('bcryptjs');
var emailValidator = require('email-validator');
var ObjectId = String;
var shared = require('../routes/shared/shared');
var dateFormat = require('date-and-time');
var now = new Date();
var date = dateFormat.format(now, 'YYYY-MM-DD')


router.post('/signin', async (req, res) => {

  User.findOne({$and :[{ $or: [{ email: req.body.emailphoneNumber }, { mobileNumber: req.body.emailphoneNumber }] } , {status : "1"}]}, async (err, doc) => {
    if (err) { res.send(err) }
    else {
      if (doc) {
          if (await bcrypt.compare(req.body.password, doc.password)) {

            User.updateOne({ _id: ObjectId(doc._id) }, { $set: { "deviceToken": req.body.deviceToken, "osType": req.body.osType } }, (siErr, sires) => {
              if (siErr) { res.send(siErr) }
              else {
                res.json({
                  status: 200, message: "login successfully", data: {
                    _id: doc._id,
                  }
                });
              }
            });

          } else {
            res.json({ status: 401, message: "password is incorrect" })
          }
      } else {
        res.json({ status: 404, message: "User not found" })
      }
    }
  })
});
router.post('/signup', async (req, res) => {

  async function UserRecordInsert(req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    var record = new User();
    record.name = req.body.name,
      record.email = req.body.email,
      record.mobileNumber = req.body.mobileNumber,
      record.password = hashedPassword,
      record.deviceToken = req.body.deviceToken,
      record.osType = req.body.osType,
      record.created_at = date;
      record.bookingId = ""
      record.otp = "",
      record.status = "0"

    record.save((saveErr, saveRes) => {
      if (saveErr) { res.send(saveErr) }
      else {
        if (saveRes) {
          let collectionName = User;
          let mobileNumber = req.body.mobileNumber;
          let message = "User MobileNumber Verfication OTP"
          let id = saveRes._id;
          shared.sendOtp(collectionName, id, mobileNumber, message, res)
        }
      }
    })
  }
  if ((emailValidator.validate(req.body.email)) && (/^\d{10}$/.test(req.body.mobileNumber))) {
    User.findOne({ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, async (userErr, userRes) => {
      if (userErr) { res.send(userErr) }
      else {
        if (userRes) {
          if (userRes.status == "1") {
            res.json({ status: 400, message: "email or mobileNumber already exit" })
          } else {
            if (userRes.status == "0") {

              let hashedPassword = await bcrypt.hash(req.body.password, 10)

              let updateObj = {
                name: req.body.name,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                password: hashedPassword,
                deviceToken: req.body.deviceToken,
                osType: req.body.osType,
                created_at: date,
                otp: "",
                status: "0"
              }
              User.updateOne({ _id: ObjectId(userRes._id) }, { $set: updateObj }, (updateErr, updateRes) => {
                if (updateErr) { res.send(updateErr) }
                else {
                  if (updateRes) {
                    let collectionName = User;
                    let mobileNumber = req.body.mobileNumber;
                    let message = "User MobileNumber Verfication OTP"
                    let id = userRes._id;
                    shared.sendOtp(collectionName, id, mobileNumber, message, res)
                  }
                }
              })
            } else {
              res.json({ status: 500, message: "status Error" })
            }
          }
        } else {
          UserRecordInsert(req, res);
        }
      }
    })
  } else {
    res.json({ status: 400, message: "Invalid email or mobileNumber format" })
  }
})
router.post('/sendOtp', function (req, res) {

  User.findOne({ $and: [{ mobileNumber: req.body.mobileNumber }] }, function (err, resDoc) {
    if (err) { res.send(err) }
    else {
      if (resDoc) {
        User.updateOne({ _id: ObjectId(resDoc._id) }, { $set: { "deviceToken": req.body.deviceToken, "osType": req.body.osType } }, (deErr, deRes) => {
          if (deErr) { res.send(deErr) }
          else {

            let collectionName = User;
            let mobileNumber = req.body.mobileNumber;
            let message = "Your Confidential Login OTP"
            let id = resDoc._id;
            shared.sendOtp(collectionName, id, mobileNumber, message, res);

          }
        })
      } else {
        res.json({ status: 404, message: "user not found" });

      }
    }
  })
});
router.post("/verifyOtp", function (req, res) {

  User.findOne({ _id: ObjectId(req.body.userId) }, function (err, doc) {
    if (err) { res.send(err) }
    else {
      if (doc) {
        if (doc.otp == req.body.otp) {

          res.json({
            status: 200, message: "login successfully", result: {
              _id: doc._id,
            }
          })
          User.updateOne({ _id: ObjectId(doc._id) }, { $set: { "otp": "", status: "1" } }, function (req, res) { })
        } else {

          res.json({ status: 400, message: "invalid otp" })

        }

      } else {

        res.json({ status: 404, message: "invalid user _id" })

      }
    }

  })
});
router.post("/changePassword", async (req, res) => {

  if (req.body.userId == "" || req.body.userId == null || req.body.currentPassword == "" || req.body.currentPassword == null || req.body.newPassword == "" || req.body.newPassword == null) {

    res.json({ status: 209, message: "some parameters missing" })

  } else {
    User.findById({ _id: ObjectId(req.body.userId) }, async (err, userDoc) => {
      if (err) { res.send(err) }
      else {
        if (userDoc) {
          if (await bcrypt.compare(req.body.currentPassword, userDoc.password)) {

            var newPassword = await bcrypt.hash(req.body.newPassword, 10)

            User.updateOne({ _id: userDoc._id }, { $set: { "password": newPassword } }, async (updateError, updateRes) => {
              if (updateError) { res.send(updateError) }
              else {
                res.json({ status: 200, message: "password update successfully" })
              }
            })

          } else {
            res.json({ status: 400, message: "please enter valid current password" })
          }
        } else {
          res.json({ status: 404, message: "user not found" })
        }
      }
    })
  }
});
router.post("/forgetPassword", async (req, res) => {

  User.findOne({ $or: [{ email: req.body.emailphoneNumber }, { mobileNumber: req.body.emailphoneNumber }] }, async (err, userRes) => {
    if (err) { res.send(err) }
    else {
      if (userRes) {
        if (userRes.email == req.body.emailphoneNumber) {
          var userOtp = generateOtp.generate(6, { specialChars: false, alphabets: false });
          var transporter = Email.createTransport({
            service: 'gmail',
            auth: {
              user: 'macsoftechnologies@gmail.com',
              pass: 'Macsof12!@'
            }
          });
          var mailOptions = {
            from: 'macsoftechnologies@gmail.com',
            to: req.body.emailphoneNumber,
            subject: 'NextLevel Account Recover',
            text: 'Account Recovery Verfication Code' + userOtp
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.send(error)
            } else {
              res.json({ status: 200, message: "Account Recovery Verfication Code sent sucessfully" })
            }
          });
        } else {

          //send account recovery verfication code for MobileNumber
          let collectionName = User;
          let mobileNumber = req.body.mobileNumber;
          let message = "account Recover Verfication Code"
          let id = userRes._id;
          shared.sendOtp(collectionName, id, mobileNumber, message, res);
        }

      } else {
        res.json({ status: 404, message: "user not found" })
      }
    }

  })

});

module.exports = router;
