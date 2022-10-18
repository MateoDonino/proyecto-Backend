const admin = true

const isAdmin = (req, res, next) => {
	if (admin) {
		next()
	} else {
		res
			.status(403)
			.send(
				`Sorry but you are not an admin and you do not have access to route ${req.url}`
			)
	}
}

module.exports = isAdmin
