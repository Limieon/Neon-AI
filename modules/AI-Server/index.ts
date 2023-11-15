import FS from 'fs'
import Path from 'path'

import 'dotenv/config'

import Express, { application } from 'express'
import LlamaInstance from './LlamaInstance'

// ENV Variables
const {
	NEONAI_AI_SERVER_FUNC_MODEL = 'models/llama-2-7b-function-calling.Q3_K_M.gguf',
	NEONAI_AI_SERVER_FUNC_PROMPT = 'prompts/function.txt',
	NEONAI_AI_SERVER_FUNC_THREADS = 4,
	NEONAI_AI_SERVER_CHAT_MODEL = 'wizardlm-13b-v1.2.Q3_K_M.gguf',
	NEONAI_AI_SERVER_CHAT_PROMPT = 'prompts/chat.txt',
	NEONAI_AI_SERVER_CHAT_THREADS = 4,
	NEONAI_AI_SERVER_PORT = 20176,
} = process.env

const app = Express()
app.use(Express.json({}))

const models = [
	new LlamaInstance('function', NEONAI_AI_SERVER_FUNC_MODEL, NEONAI_AI_SERVER_FUNC_PROMPT, Number(NEONAI_AI_SERVER_FUNC_THREADS)),
	new LlamaInstance('chat', NEONAI_AI_SERVER_CHAT_MODEL, NEONAI_AI_SERVER_CHAT_PROMPT, Number(NEONAI_AI_SERVER_CHAT_THREADS)),
]

for (let m of models) {
	m.registerHTTP(app)
	m.init()
}

app.listen(NEONAI_AI_SERVER_PORT, () => {
	console.log(`Listening on port ${NEONAI_AI_SERVER_PORT}`)
})
