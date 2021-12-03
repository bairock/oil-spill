const bcrypt = require('bcryptjs')

const { prisma } = require('./context')

async function generateUser() {
    const email = process.env.USER_EMAIL
    const password = process.env.USER_PASSWORD
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) return
    const hash = bcrypt.hashSync(password)
    await prisma.user.create({
        data: {
            email,
            password: hash,
            name: 'John Doe'
        }
    })
    console.log('User created')
}

module.exports = {
    generateUser
}
