import FS from 'fs'
import Path from 'path'

import Express from 'express'

import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp'
import WebSocketimport, { WebSocketServer } from 'ws'
import { Http2Server } from 'http2'
import { IncomingMessage } from 'http'
import internal from 'stream'

export default class LlamaInstance {
	constructor(name: string, modelFile: string, promptFile: string, threads: number, app: Express.Application) {
		this.#name = name
		this.#prompt = FS.readFileSync(promptFile, { encoding: 'utf-8' })
		this.#modelPath = Path.join(process.cwd(), modelFile)
		this.#threads = threads
		this.#initialized = false
		this.#socket = new WebSocketServer({ noServer: true })

		app.post(`/${this.#name}`, async (req, res) => {
			const { prompt } = req.body
			res.status(200)
			res.send(await this.prompt(prompt))
		})

		app.get(`/${this.#name}`, async (req, res) => {
			res.status(200)
			res.json({
				ready: this.isReady(),
				initialized: this.#initialized,
			})
		})

		this.#socket.on('connection', (socket) => {
			console.log(`Client connceted to ${this.#name}!`)

			const e = socket.on('message', async (msg) => {
				socket.send(await this.prompt(msg.toString()))
			})

			socket.once('close', () => {
				console.log(`Client disconnected from ${this.#name}!`)
				e.close()
			})
		})
	}

	onUpgrade(url: string, req: IncomingMessage, socket: internal.Duplex, head: Buffer) {
		console.log(url)

		if (url === `/${this.#name}`) {
			this.#socket.handleUpgrade(req, socket, head, (ws) => {
				this.#socket.emit('connection', ws, req)
			})
		}
	}

	async init() {
		console.log(`Initializing '${this.#name}'...`)
		if (this.#initialized) return
		this.#initialized = true

		this.#model = new LlamaModel({
			modelPath: this.#modelPath,
		})

		this.#context = new LlamaContext({
			model: this.#model,
			threads: this.#threads,
		})

		this.#session = new LlamaChatSession({
			context: this.#context,
			systemPrompt: this.#prompt,
		})

		await this.#session.init()
	}
	async prompt(prompt: string) {
		if (!this.#initialized) {
			await this.init()
		}

		return await this.#session.prompt(prompt, {})
	}

	getPrompt(): string {
		return this.#prompt
	}
	getName(): string {
		return this.#name
	}
	isReady(): boolean {
		return this.#session.initialized
	}
	isInitialized(): boolean {
		return this.#initialized
	}

	#name: string
	#prompt: string
	#modelPath: string
	#threads: number
	#initialized: boolean
	#socket: WebSocketServer

	#session?: LlamaChatSession
	#context?: LlamaContext
	#model?: LlamaModel
}
