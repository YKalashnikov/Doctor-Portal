const express = require('express')
const router = express.Router()
const {authOwner} = require('../middleware/auth')
const Patient = require('../models/Patient')

//patients patients/add ADD form
    router.get('/add', authOwner, (req, res)=> {
    res.render('patients/add')
})

//     Show all patients
//    GET /patients
router.get('/', authOwner, async (req, res) => {
    try {
      const patients = await Patient.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
  
      res.render('patients/index', {
        patients,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

//    Process add form
//   POST /patients
router.post('/', authOwner, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Patient.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

//  Show single Patient
//  GET /patients/:id
router.get('/:id', authOwner, async (req, res) => {
    try {
      let patient = await Patient.findById(req.params.id).populate('user').lean()
      if (!patient) {
        return res.render('error/404')
      }
  
      res.render('patients/show', {
        patient,
      })
    } catch (err) {
      console.error(err)
      res.render('error/404')
    }
  })

//    Show edit page
//    GET /patients/edit/:id
router.get('/edit/:id', authOwner, async (req, res) => {
    try {
      const patient = await Patient.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!patient) {
        return res.render('error/404')
      }
  
      if (patient.user != req.user.id) {
        res.redirect('/patients')
      } else {
        res.render('patients/edit', {
          patient,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  
//    Update patient
//   PUT /patients/:id
router.put('/:id', authOwner, async (req, res) => {
    try {
      let patient = await Patient.findById(req.params.id).lean()
      if (!patient) {
        return res.render('error/404')
      }
  
      if (patient.user != req.user.id) {
        res.redirect('/patients')
      } else {
        patient = await Patient.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
 
 

//    Delete patient
//    DELETE /patients/:id
router.delete('/:id', authOwner, async (req, res) => {
    try {
      let patient = await Patient.findById(req.params.id).lean()
      if (!patient) {
        return res.render('error/404')
      }
  
      if (patient.user != req.user.id) {
        res.redirect('/patients')
      } else {
        await Patient.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

//    User patients
//   GET /patients/user/:userId
router.get('/user/:userId', authOwner, async (req, res) => {
    try {
      const patients = await Patient.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('patients/index', {
        patients,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })



module.exports = router
