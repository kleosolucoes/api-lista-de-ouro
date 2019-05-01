import mongoose from 'mongoose'
const Schema = mongoose.Schema

let schema = new Schema({
	data_criacao: {type: String, required: true},
	hora_criacao: {type: String, required: true},
	acoes: {type: Array, required: true},
	no_id: {type: String, required: false},
})

module.exports = mongoose.model('Acao', schema)
