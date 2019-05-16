import express from 'express'
import noController from '../controllers/no.controller'

const router = express.Router()
router.post('/registrar', noController.registrar)
router.post('/sincronizar', noController.sincronizar)

module.exports = router
