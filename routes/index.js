const express = require("express")
const productsRouter = require("./products.router")
const cartRouter = require("./cart.router")
const { Router } = express

function routerApi(app) {
	const router = Router()
	app.use("/api", router)
	router.use("/products", productsRouter)
	router.use("/cart", cartRouter)
}
module.exports = routerApi
