import express from 'express'
import indexController from '../controllers/index.controller'

const router = express.Router()
router.get('/', indexController.index)

module.exports = router
