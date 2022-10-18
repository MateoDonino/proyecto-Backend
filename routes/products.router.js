const express = require("express")
const { Router } = express
const Products = require("../container/container")
const isAdmin = require("../middlewares/isAdmin")

const productList = new Products("products")

const router = Router()

router.get("/", (req, res) => {
	productList.getAll().then((data) => {
		res.json(data)
	})
})

router.get("/:id", (req, res) => {
	const { id } = req.params
	if (id) {
		productList.getById(id).then((data) => {
			if (data) {
				res.json(data)
			} else {
				res.json({ error: "Producto no encontrado" })
			}
		})
	}
})

router.post("/", (req, res, next) => {
	let { body } = req

	isAdmin(req, res, next)

	const products = productList.getAll()
	const productId = products.length + 1

	if (
		body.title &&
		body.price &&
		body.thumbnail &&
		body.code &&
		body.stock &&
		body.description
	) {
		body = {
			...body,
			timestamp: Date.now(),
			id: productId,
		}
		productList.save(body).then(() => {
			res.json({ success: "ok", newProduct: productId })
		})
	} else {
		res.json({ error: "Datos incompletos, vuelva a cargar el product" })
	}
})

router.put("/:id", async (req, res, next) => {
	const { id } = req.params
	const { body } = req

	isAdmin(req, res, next)

	let completeList = await productList.getAll()

	const productoToChange = completeList.find((el) => el.id == Number(id))

	if (productoToChange) {
		productoToChange.title = body.title
		productoToChange.description = body.description
		productoToChange.price = body.price
		productoToChange.code = body.code
		productoToChange.id = Number(id)

		let lugarDelObjt = completeList.findIndex((el) => el.id == id)

		completeList[lugarDelObjt] = productoToChange

		productList.deleteById(id).then((data) => {
			productList.save(productoToChange).then((data) => {
				res.json({ success: "ok", updated: productoToChange })
			})
		})
	} else {
		res.json({ error: "Producto no encontrado" })
	}
})

router.delete("/:id", (req, res, next) => {
	isAdmin(req, res, next)

	let { id } = req.params

	id = parseInt(id)

	productList.deleteById(id).then((data) => {
		if (data) {
			res.json({ success: "ok", deleted: data })
		} else {
			res.json({ error: "Producto no encontrado" })
		}
	})
})

module.exports = router
