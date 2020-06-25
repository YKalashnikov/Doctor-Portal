const express = require('express')
const router = express.Router()
const {authOwner,authGuest} = require('../middleware/auth')
const Patient = require('../models/Patient')

//Login Landing Page GET/
router.get('/', authGuest, (req, res)=> {
     res.render('login', {
         layout:'login',
     })
})

//Login Landing Page GET/dashboard
router.get('/dashboard', authOwner, async(req, res)=> {
   const patients = await Patient.find({user :req.user.id}).lean()
    res.render('dashboard', {
       name: req.user.firstName,
       patients
    })
})


  

module.exports = router