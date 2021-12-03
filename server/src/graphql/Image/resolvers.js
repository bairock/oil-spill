const { prisma } = require('../../../utils/context')

const Image = {
  Query: {
    findUniqueImage: (_parent, args, { verify }) => {
      return prisma.image.findUnique(args)
    },
    findFirstImage: (_parent, args, { verify }) => {
      return prisma.image.findFirst(args)
    },
    findManyImage: (_parent, args, { verify }) => {
      return prisma.image.findMany(args)
    },
    findManyImageCount: (_parent, args, { verify }) => {
      return prisma.image.count(args)
    },
    aggregateImage: (_parent, args, { verify }) => {
      return prisma.image.aggregate(args)
    },
  },
  Mutation: {
    createOneImage: (_parent, args, { verify }) => {
      return prisma.image.create(args)
    },
    updateOneImage: (_parent, args, { verify }) => {
      return prisma.image.update(args)
    },
    deleteOneImage: async (_parent, args, { verify }) => {
      return prisma.image.delete(args)
    },
    upsertOneImage: async (_parent, args, { verify }) => {
      return prisma.image.upsert(args)
    },
    deleteManyImage: async (_parent, args, { verify }) => {
      return prisma.image.deleteMany(args)
    },
    updateManyImage: (_parent, args, { verify }) => {
      return prisma.image.updateMany(args)
    },
  },
}

module.exports = {
  Image,
}
