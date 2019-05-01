import mongoose from 'mongoose'
const Schema = mongoose.Schema

let schema = new Schema({
	data_criacao: {type: String, required: true},
	hora_criacao: {type: String, required: true},
	data_inativacao: {type: String, required: false},
	hora_inativacao: {type: String, required: false},
	nome: {type: String, required: true, max: 150},
	email: {type: String, required: true, max: 100},
	senha: {type: String, required: true, max: 16},
	telefone: {type: Number, required: false},
	pai_id: {type: String, required: false},
})

module.exports = mongoose.model('No', schema)
