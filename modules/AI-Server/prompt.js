import Axios from 'axios'

console.log(
	(
		await Axios.post(`http://127.0.0.1:20176/${process.argv[2]}`, {
			prompt: process.argv[3],
		})
	).data
)
