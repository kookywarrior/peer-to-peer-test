;(async () => {
	const loading = document.getElementById("loading")

	if (!window.peerjs?.util?.supports?.data) {
		loading.hidden = true
		document.getElementById("not-support").hidden = false
		return
	}

	const input = document.getElementById("input")
	const output = document.getElementById("output")
	const send = document.getElementById("send")
	const copy = document.getElementById("copy")

	window.peer = new window.peerjs.Peer()
	var ownID = null
	var connections = {}

	peer.on("open", (id) => {
		ownID = id
		loading.hidden = true
		copy.hidden = false
		output.hidden = false
	})

	peer.on("connection", (conn) => {
		if (Object.keys(connections).length === 0) {
			input.hidden = false
			send.hidden = false
		}

		const needScroll = output.scrollHeight - output.scrollTop <= output.clientHeight + 20
		output.value += `Connected to ${conn.peer}\n`
		if (needScroll) {
			output.scrollTop = output.scrollHeight
		}

		connections[conn.peer] = conn

		conn.on("data", (data) => {
			if (data === "ping") {
				conn.send("pong")
			} else {
				const needScroll = output.scrollHeight - output.scrollTop <= output.clientHeight + 20
				output.value += `Received from ${conn.peer}: ${data}\n`

				if (needScroll) {
					output.scrollTop = output.scrollHeight
				}
			}
		})
	})

	copy.onclick = () => {
		navigator.clipboard.writeText(ownID)
		copy.innerText = "Copied!"
		setTimeout(() => {
			copy.innerText = "Copy ID"
		}, 500)
	}

	send.onclick = () => {
		for (const conn in connections) {
			connections[conn].send(input.value)
		}

		const needScroll = output.scrollHeight - output.scrollTop <= output.clientHeight + 20
		output.value += `Sent to Everyone: ${input.value}\n`
		if (needScroll) {
			output.scrollTop = output.scrollHeight
		}

		input.value = ""
	}
})()
