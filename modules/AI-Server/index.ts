import FS from 'fs'
import Path from 'path'

import 'dotenv/config'

import Express, { application } from 'express'
import Chalk from 'chalk'

import HTTP from 'http2'
import URL from 'url'

import LlamaInstance from './LlamaInstance'
import Config from './Config.js'

// ENV Variables
const { NEONAI_AI_SERVER_CONFIG_FILE = 'config.json', NEONAI_AI_SERVER_PORT = 20176 } = process.env
Config.load(Path.join(process.cwd(), NEONAI_AI_SERVER_CONFIG_FILE))

const app = Express()
app.use(Express.json({}))

const models: LlamaInstance[] = []
for (let id of Config.getModels()) {
	const model = Config.getModel(id)

	console.log(`Loading model ${id}... `)
	const instance = new LlamaInstance(id, model.model, model.prompt, model.threads, app)
	await instance.init()

	models.push(instance)
}

for (let m of models) {
	m.init()
}

app.get('/', (req, res) => {
	const out: any = {}

	for (var m of models) {
		out[m.getName()] = {
			id: m.getName(),
			ready: m.isReady(),
			initialized: m.isInitialized(),
		}
	}

	res.status(200)
	res.send(out)
})

const server = app.listen(NEONAI_AI_SERVER_PORT, () => {
	console.log(`HTTP Server listening on port ${NEONAI_AI_SERVER_PORT}`)
})

server.on('upgrade', (req, socket, head) => {
	if (req.url == undefined) return

	let url = URL.parse(req.url, false).pathname
	if (url == undefined) return

	for (var m of models) {
		m.onUpgrade(url, req, socket, head)
	}
})
