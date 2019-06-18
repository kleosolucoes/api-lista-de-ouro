import No from '../models/no.model'
import Prospecto from '../models/prospecto.model'
import Acao from '../models/acao.model'
import Historico from '../models/historico.model'
import bcrypt from 'bcrypt-nodejs'
import { 
	objetoDeRetorno, 
} from '../constants'

exports.registrar = (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
		if(
			req.body.nome 
			&& req.body.ddd
			&& req.body.telefone
			&& req.body.email
			&& req.body.senha
		){
			No.findOne({
				email: req.body.email, 
				data_inativacao: null
			}, (err, elemento) => {
				if(err){
					objetoDeRetorno.menssagem = 'Erro ao buscar usuario' 
					return res.json(objetoDeRetorno)
				}
				if(elemento === null){
					const senhaTexto = req.body.senha
					bcrypt.hash(senhaTexto, null, null, (err, senhaHash) => {
						if(err){
							objetoDeRetorno.menssagem = 'Erro ao transformar senha' 
							return res.json(objetoDeRetorno)
						}

						const noNovo = new No({
							data_criacao: pegarDataEHoraAtual()[0],
							hora_criacao: pegarDataEHoraAtual()[1],
							nome: req.body.nome,
							ddd: req.body.ddd,
							telefone: req.body.telefone,
							email: req.body.email,
							senha: senhaHash,
							pai_id: req.body.pai_id ? req.body.pai_id : null,
						})
						noNovo.save((err, no) => {
							if(err){
								objetoDeRetorno,menssagem = err
								return res.send(objetoDeRetorno)
							}
							objetoDeRetorno.ok = true
							return res.send(objetoDeRetorno)
						})

					})

				}else{
					objetoDeRetorno.menssagem = 'Email já utilizado' 
					return res.json(objetoDeRetorno)
				}
			})
		}else{
			objetoDeRetorno,menssagem = 'Dados Invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
}

exports.logar = async (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
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
				objetoDeRetorno.resultado.no_id = noSelecionado.id
				if(noSelecionado.nomeCaptura !== undefined){
					objetoDeRetorno.resultado.nomeCaptura = noSelecionado.nomeCaptura
				}
				if(noSelecionado.url !== undefined){
					objetoDeRetorno.resultado.url = noSelecionado.url
				}
				return res.send(objetoDeRetorno)
			}else{
				objetoDeRetorno.menssagem = 'Senha não iguais'
				return res.send(objetoDeRetorno)
			}
		}else{
			objetoDeRetorno.menssagem = 'Dados invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
}

exports.sincronizar = async (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
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
				return res.send(objetoDeRetorno)
			}else{
				objetoDeRetorno.menssagem = 'Senha não iguais'
				return res.send(objetoDeRetorno)
			}
		}else{
			objetoDeRetorno.menssagem = 'Dados invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}

}

function pegarDataEHoraAtual(){                                                                                                                                                                   
	let dados = []
	const dataAtual = new Date()
	const diaParaDataDeCriacao = dataAtual.getDate().toString().padStart(2, '0')
	let mesParaDataDeCriacao = dataAtual.getMonth()+1
	mesParaDataDeCriacao = mesParaDataDeCriacao.toString().padStart(2, '0')
	const anoParaDataDeCriacao = dataAtual.getFullYear()
	const dataDeCriacao = diaParaDataDeCriacao + '/' + mesParaDataDeCriacao + '/' + anoParaDataDeCriacao
	const horaDeCriacao = dataAtual.getHours().toString().padStart(2, '0')
		+':'+dataAtual.getMinutes().toString().padStart(2, '0')
		+':'+dataAtual.getSeconds().toString().padStart(2, '0')

	dados.push(dataDeCriacao)
	dados.push(horaDeCriacao)

	return dados
}

exports.cadastrarProspecto = (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
		if(
			req.body.nome 
			&& req.body.ddd
			&& req.body.telefone
			&& req.body.no_id
		){
			const novoProspecto = new Prospecto({
				data_criacao: pegarDataEHoraAtual()[0],
				hora_criacao: pegarDataEHoraAtual()[1],
				nome: req.body.nome,
				ddd: req.body.ddd,
				telefone: req.body.telefone,
				email: req.body.email ? req.body.email : null,
				sincronizado: false,
				no_id: req.body.no_id,
			})
			novoProspecto.save((err, no) => {
				if(err){
					objetoDeRetorno,menssagem = err
					return res.send(objetoDeRetorno)
				}
				objetoDeRetorno.ok = true
				return res.send(objetoDeRetorno)
			})
		}else{
			objetoDeRetorno.menssagem = 'Dados invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
}

exports.alterar = async (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
		if(
			req.body.nomeCaptura
			&& req.body.url
			&& req.body.email
		){
			const noSelecionado = await No.findOne({email: req.body.email})
			if(noSelecionado === null){
				objetoDeRetorno.menssagem = 'Não registrado'
				return res.send(objetoDeRetorno)
			}

			noSelecionado.nomeCaptura = req.body.nomeCaptura
			noSelecionado.url = req.body.url
			noSelecionado.apelido = req.body.apelido ? req.body.apelido : null

			noSelecionado.save((err, no) => {
				if(err){
					objetoDeRetorno,menssagem = err
					return res.send(objetoDeRetorno)
				}
				objetoDeRetorno.ok = true
				return res.send(objetoDeRetorno)
			})
		}else{
			objetoDeRetorno.menssagem = 'Dados invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
}

exports.apelido = async (req, res, next) => {
	objetoDeRetorno.ok = false 
	objetoDeRetorno.menssagem = ''
	objetoDeRetorno.resultado = {}
	try{
		if(
			req.body.apelido
		){
			const noSelecionado = await No.findOne({apelido: req.body.apelido})
			objetoDeRetorno.ok = true
			objetoDeRetorno.resultado.no_id = noSelecionado.id
			return res.send(objetoDeRetorno)
		}else{
			objetoDeRetorno.menssagem = 'Dados invalidos'
			return res.send(objetoDeRetorno)
		}
	}catch(error){
		objetoDeRetorno.menssagem = error
		return res.send(objetoDeRetorno)
	}
}
