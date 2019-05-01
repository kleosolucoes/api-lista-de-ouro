import mongoose from 'mongoose'
const Schema = mongoose.Schema

let schema = new Schema({
	data_criacao: {type: String, required: true},
	hora_criacao: {type: String, required: true},
	nome: {type: String, required: true, max: 150},
	telefone: {type: Number, required: false},
	email: {type: String, required: false, max: 100},
	sincronizado: {type: Boolean, required: true},
	no_id: {type: String, required: true},
})

module.exports = mongoose.model('Prospecto', schema)
