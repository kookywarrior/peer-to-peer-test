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
	const ping = document.getElementById("ping")

	window.peer = new window.peerjs.Peer()
	var conn = null
	var pingTimer = null

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
			ping.hidden = false
			output.hidden = false
			input.value = ""
			input.placeholder = "Enter Message"
			output.value = "Connected to Host\n"

			conn.on("data", (data) => {
				const needScroll = output.scrollHeight - output.scrollTop <= output.clientHeight + 20

				if (data === "pong" && pingTimer) {
					const time = performance.now() - pingTimer
					output.value += `Ping: ${time}ms\n`
					pingTimer = null
					conn.send(`ping ${time}ms`)
				} else {
					output.value += `Received: ${data}\n`
				}

				if (needScroll) {
					output.scrollTop = output.scrollHeight
				}
			})
		})
	}

	send.onclick = () => {
		conn.send(input.value)

		const needScroll = output.scrollHeight - output.scrollTop <= output.clientHeight + 20
		output.value += `Sent: ${input.value}\n`
		if (needScroll) {
			output.scrollTop = output.scrollHeight
		}
		input.value = ""
	}

	ping.onclick = () => {
		pingTimer = performance.now()
		conn.send("ping")
	}
})()
