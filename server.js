const express = require("express")
const routerApi = require("./routes")

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static(__dirname + "/public"))

// app.use("/api/products", router)

app
	.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
	.on("error", (err) => {
		console.log(err)
	})

routerApi(app)
