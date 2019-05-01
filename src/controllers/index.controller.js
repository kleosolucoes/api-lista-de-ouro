import No from '../models/no.model'
import { objetoDeRetorno, gerarToken, enviarEmail } from '../constants'

exports.index = (req, res, next) => {
	res.send('api lista de ouro')
}
