import WebSocket from 'ws'

import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
})

const socket = new WebSocket(`ws://127.0.0.1:20176/${process.argv[2]}`)
socket.on('message', (msg) => {
	const json = JSON.parse(msg.toString())
	const { type } = json

	if (type === 'start') {
		process.stdout.write('AI: ')
	} else if (type === 'token') {
		process.stdout.write(json.data)
	} else if (type === 'done') {
		console.log()
	}
})

rl.on('line', (l) => {
	socket.send(l)
})

rl.on('close', () => {})
