import FS from 'fs'
import Path from 'path'

import Express from 'express'

import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp'

export default class LlamaInstance {
	constructor(name: string, modelFile: string, promptFile: string, threads: number) {
		this.#name = name
		this.#prompt = FS.readFileSync(promptFile, { encoding: 'utf-8' })
		this.#modelPath = Path.join(process.cwd(), modelFile)
		this.#threads = threads

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
	}

	registerHTTP(app: Express.Application) {
		app.post(`/${this.#name}`, async (req, res) => {
			const { prompt } = req.body
			res.status(200)
			res.send(await this.prompt(prompt))
		})

		app.get(`/${this.#name}`, async (req, res) => {
			res.status(200)
			res.json({
				ready: this.isReady(),
			})
		})
	}

	async init() {
		console.log(`Initializing '${this.#name}'...`)
		await this.#session.init()
	}
	async prompt(prompt: string) {
		return await this.#session.prompt(prompt, {})
	}

	getPrompt(): string {
		return this.#prompt
	}
	isReady(): boolean {
		return this.#session.initialized
	}

	#name: string
	#prompt: string
	#modelPath: string

	#session: LlamaChatSession
	#threads: number
	#context: LlamaContext
	#model: LlamaModel
}
