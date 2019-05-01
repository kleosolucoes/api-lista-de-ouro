// app.js
import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import indexRoute from './routes/index.route'
import noRoute from './routes/no.route'
import { verifyJWT } from './constants'
import mongoose from 'mongoose'

const app = express()

//DATABASE SETTINGS
let mongoDB = 'mongodb://listadourada:f6mj5SB8ZwjrzKrX@ds147746.mlab.com:47746/lista-dourada'
mongoose.connect(mongoDB, { useNewUrlParser: true})
mongoose.Promise = global.Promise
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//CORS SETTINGS
const cors = require('cors')
const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))
app.options('*', cors())

//GENERAL SETTINGS
app.use(morgan('dev'))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', indexRoute)
app.use('/no', noRoute)

//SERVER LISTENER SETTINGS
const port = normalizaPort(process.env.PORT || '8080')
function normalizaPort(val) {
	const port = parseInt(val, 10)
	if (isNaN(port)) {
		return val
	}
	if (port >= 0) {
		return port
	}
	return false
}

app.listen(port, () => {
	console.log('Server: ' + port);
});
