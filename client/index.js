;(async () => {
	const loading = document.getElementById("loading")

	if (!window.peerjs?.util?.supports?.data) {
		loading.hidden = true
		document.getElementById("not-support").hidden = false
		return
	}

	const input = document.getElementById("input")
	const output = document.getElementById("output")
	const connect = document.getElementById("connect")
	const send = document.getElementById("send")

	window.peer = new window.peerjs.Peer()
	var conn = null

	peer.on("open", (id) => {
		loading.hidden = true
		input.hidden = false
		connect.hidden = false
	})

	connect.onclick = async () => {
		conn = peer.connect(input.value)
		conn.on("open", () => {
			connect.hidden = true
			send.hidden = false
			output.hidden = false
			input.value = ""
			input.placeholder = "Enter Message"
			output.value = "Connected to Host\n"

			conn.on("data", (data) => {
				output.value += `Received: ${data}\n`
			})
		})
	}

	send.onclick = () => {
		conn.send(input.value)
		output.value += `Sent: ${input.value}\n`
		input.value = ""
	}
})()
