const { Image } = require('./Image/resolvers')
const { Target } = require('./Target/resolvers')
const { User } = require('./User/resolvers')

const resolvers = [User, Target, Image]

module.exports = { resolvers }
