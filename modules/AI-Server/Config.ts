import FS from 'fs'

export type ConfigType_Model = {
	model: string
	prompt: string
	threads: number
	preload: boolean
}
export type ConfigType = {
	models: { [key: string]: ConfigType_Model }
}

export default class Config {
	static load(file: string) {
		this.#config = JSON.parse(FS.readFileSync(file, { encoding: 'utf-8' }))
	}

	static getModels(): string[] {
		return Object.keys(this.#config.models)
	}
	static getModel(id: string): ConfigType_Model {
		const m = this.#config.models[id]

		if (m.model == undefined || m.prompt == undefined) throw new Error(`Model ${id} is missing a model or prompt property!`)

		return {
			model: m.model,
			preload: m.preload ? m.preload : false,
			prompt: m.prompt,
			threads: m.threads ? m.threads : 2,
		}
	}

	static #config: ConfigType
}
