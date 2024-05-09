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

		output.value += `Connected to ${conn.peer}\n`
		connections[conn.peer] = conn

		conn.on("data", (data) => {
			output.value += `Received from ${conn.peer}: ${data}\n`
		})

		conn.on("close", () => {
			output.value += `${conn.peer} disconnected\n`
			connections[conn.peer] = null
			delete connections[conn.peer]

			if (Object.keys(connections).length === 0) {
				input.hidden = true
				send.hidden = true
				output.value = ""
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
		output.value += `Sent to Everyone: ${input.value}\n`
		input.value = ""
	}
})()
