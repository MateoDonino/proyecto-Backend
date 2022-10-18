const fs = require("fs")

class Contenedor {
	constructor(nombreArchivo) {
		this.nombreArchivo = `./archivos/${nombreArchivo}.json`
	}

	async getData() {
		try {
			return await fs.promises.readFile(this.nombreArchivo, "utf8")
		} catch (err) {
			if (err.code == "ENOENT") {
				fs.writeFile(this.nombreArchivo, "[]", (err) => {
					if (err) throw err
					console.log("Se creo el archivo")
				})
			}
		}
	}

	async getAll() {
		const data = await this.getData()
		return JSON.parse(data)
	}

	async save(obj) {
		try {
			let fileContent = await this.getData()
			let jsonContent = JSON.parse(fileContent)
			let array = []
			const indice = jsonContent.map((x) => x.id).sort()
			obj.id = !obj.id ? indice[indice.length - 1] + 1 : obj.id

			if (!obj.id) {
				obj.id = 1
				array = [{ ...obj }]
				await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(array))
				return array[0].id
			}

			jsonContent.push(obj)

			await fs.promises.writeFile(
				this.nombreArchivo,
				JSON.stringify(jsonContent)
			)
		} catch (err) {
			console.log(err)
		}
	}

	async getById(id) {
		const data = await this.getData()
		const jsonContent = JSON.parse(data)
		const obj = jsonContent.find((x) => x.id == id)
		return obj
	}

	async deleteById(id) {
		const data = await this.getData()
		const jsonContent = JSON.parse(data)
		const obj = jsonContent.find((x) => x.id == id)
		console.log(obj)
		if (obj) {
			const index = jsonContent.indexOf(obj)
			jsonContent.splice(index, 1)
			await fs.promises.writeFile(
				this.nombreArchivo,
				JSON.stringify(jsonContent)
			)
			return "Eliminado correctamente"
		} else {
			return null
		}
	}

	async deleteAll() {
		try {
			fs.writeFile(this.nombreArchivo, "[]", (err) => {
				if (err) throw err
				console.log("Se creo el archivo")
			})
		} catch (err) {
			console.log(err)
		}
	}
}

module.exports = Contenedor
