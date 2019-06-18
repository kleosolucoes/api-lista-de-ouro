import express from 'express'
import noController from '../controllers/no.controller'

const router = express.Router()
router.post('/registrar', noController.registrar)
router.post('/logar', noController.logar)
router.post('/sincronizar', noController.sincronizar)
router.post('/cadastrarProspecto', noController.cadastrarProspecto)
router.post('/alterar', noController.alterar)
router.post('/apelido', noController.apelido)

module.exports = router
