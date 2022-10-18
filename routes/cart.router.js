const express = require("express")
const { Router } = express
const Cart = require("../container/container")

const cartList = new Cart("cart")

const router = Router()

router.get("/", async (req, res) => {
	const cart = await cartList.getAll()
	res.json(cart)
})

router.get("/:id/products", async (req, res) => {
	const { id } = req.params
	if (id) {
		const cart = await cartList.getById(id)
		if (cart) {
			res.json(cart)
		} else {
			res.json({ error: "Producto en carrito" })
		}
	}
	// res.json(await cartList.getAll())
})

router.post("/", async (req, res) => {
	const { body } = req
	const cart = await cartList.getAll()
	if (body.products) {
		const newCart = {
			...body,
			timestamp: Date.now(),
			id: cart.length + 1,
		}
		cartList.save(newCart).then((data) => {
			res.json({ success: "ok", newCartId: newCart.id })
		})
	} else {
		res.json({ error: "Error, vuelva a enviar el carrito" })
	}
})

router.post("/:id/products", async (req, res) => {
	const { body } = req
	const { id } = req.params
	const cart = await cartList.getById(Number(id))
	if (cart) {
		const newCart = {
			...cart,
			products: [...cart.products, body],
			timestamp: Date.now(),
		}
		cartList.deleteById(id).then(() => {
			cartList.save(newCart).then((data) => {
				res.json({ success: "ok", new: newCart })
			})
		})
	} else {
		res.json({ error: "Error, vuelva a enviar el carrito" })
	}
})

router.delete("/:id/products/:id_product", async (req, res) => {
	const { id, id_product } = req.params
	console.log(id, id_product)
	const cart = await cartList.getById(Number(id))
	if (cart) {
		const filteredProducts = cart.products.filter(
			(product) => product.id !== Number(id_product)
		)
		const newCart = {
			...cart,
			products: filteredProducts,
			timestamp: Date.now(),
		}

		// cart.products = newCart
		cartList.deleteById(id).then(() => {
			cartList.save(newCart).then((data) => {
				res.json({ success: "ok", new: newCart })
			})
		})
	} else {
		res.json({ error: "Producto o carrito no encontrado" })
	}
})

module.exports = router
