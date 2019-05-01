import No from '../models/no.model'
import { objetoDeRetorno, gerarToken, enviarEmail } from '../constants'

exports.index = (req, res, next) => {
	objetoDeRetorno.ok = true 
	objetoDeRetorno.menssagem = 'API Lista de Ouro'
	objetoDeRetorno.resultado = {}
	return res.send(objetoDeRetorno)
}
