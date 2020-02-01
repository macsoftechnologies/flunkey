var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var dateFormat = require('date-and-time');
var idProofTypes1 = require('../models/partnerIdProofTypes');
var genderType = require('../models/masterGender');

// Get idTypes List
router.get('/idTypes', (req, res) => {

    idProofTypes1.find((err, CaRes) => {
        if (err) { res.send(err) }
        else {
            res.json({ status: 200, message: "idTypes", result: CaRes })
        }
    })

})

router.get('/genderTypes', (req, res) => {

    genderType.find((err, CaRes) => {
        if (err) { res.send(err) }
        else {
            res.json({ status: 200, message: "Gender Types", result: CaRes })
        }
    })
})

module.exports = router;