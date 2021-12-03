const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const context = async ({ req }) => {
    const { authorization } = req.headers

    const token = authorization ? authorization.replace('Bearer ', '') : ''

    const verify = await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return null
        }
        return decoded
    })

    return { verify }
}

module.exports = {
    context,
    prisma
}
