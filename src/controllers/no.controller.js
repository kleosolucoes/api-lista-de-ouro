import No from '../models/no.model'
import Prospecto from '../models/prospecto.model'
import Acao from '../models/acao.model'
import Historico from '../models/historico.model'
import bcrypt from 'bcrypt-nodejs'
import { 
	objetoDeRetorno, 
} from '../constants'

exports.sincronizar = async (req, res, next) => {
	try{
		objetoDeRetorno.ok = false 
		objetoDeRetorno.menssagem = ''
		objetoDeRetorno.resultado = {}
		if(req.body.email && req.body.senha){

		const noSelecionado = await No.findOne({email: req.body.email})
		if(noSelecionado === null){
			objetoDeRetorno.menssagem = 'Não registrado'
			return res.send(objetoDeRetorno)
		}
		const senhaTexto = req.body.senha + ''
		const senhasIguais = bcrypt.compareSync(senhaTexto, noSelecionado.senha)
		if(senhasIguais){
			/* senha correta */
			objetoDeRetorno.ok = true
			objetoDeRetorno.menssagem = 'Logado!!!'

			/* buscando prospectos para baixar */
			const prospectosDaWeb = await Prospecto.find({no_id: noSelecionado._id, sincronizado: false})
			objetoDeRetorno.resultado.prospectos = prospectosDaWeb
			prospectosDaWeb.forEach(prospecto => {
				prospecto.sincronizado = true
				prospecto.save((err, res) => console.log('prospecto salvo'))
			})
			/* buscando acoes do patricionador */
			const acoesDoPatricionador = await Acao.find({no_id: noSelecionado.pai_id})
			objetoDeRetorno.resultado.acoes = acoesDoPatricionador
			/* Subindo historico */
			if(req.body.historicos){
				req.body.historicos.forEach(historico => {
					const historicoNovo = new Historico({
						sincronizado: false,
						data_criacao: historico.data_criacao,
						hora_criacao: historico.hora_criacao,
						dados: historico.dados,
						no_id: noSelecionado._id,
					})
					historicoNovo.save((err, res) => console.log('historico salvo'))
				})
				objetoDeRetorno.resultado.historico = 'Historico Subiu'
			}
		}else{
			objetoDeRetorno.menssagem = 'Senha não iguais'
		}
		return res.send(objetoDeRetorno)
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
	}else{
		objetoDeRetorno.menssagem = 'Dados invalidos'
		return res.send(objetoDeRetorno)
	}
}
