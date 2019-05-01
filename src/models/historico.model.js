import mongoose from 'mongoose'
const Schema = mongoose.Schema

let schema = new Schema({
	data_criacao: {type: String, required: true},
	hora_criacao: {type: String, required: true},
	dados: {type: Array, required: true},
	no_id: {type: String, required: false},
	sincronizado: {type: Boolean, required: true},
})

module.exports = mongoose.model('Historico', schema)
