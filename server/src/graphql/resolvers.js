const { Worker } = require('./Worker/resolvers')
const { Image } = require('./Image/resolvers')
const { Target } = require('./Target/resolvers')
const { User } = require('./User/resolvers')

const resolvers = [User, Target, Image, Worker]

module.exports = { resolvers }
