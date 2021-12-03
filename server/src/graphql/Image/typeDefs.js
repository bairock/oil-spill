const { default: gql } = require('graphql-tag')

const Image = gql`
  scalar Json

  type Image {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    date: DateTime!
    target: Target
    targetId: String
    cornerCoordinates: Json!
    status: Int!
  }

  type Query {
    findUniqueImage(where: ImageWhereUniqueInput!): Image
    findFirstImage(
      where: ImageWhereInput
      orderBy: [ImageOrderByWithRelationInput]
      cursor: ImageWhereUniqueInput
      take: Int
      skip: Int
      distinct: [ImageScalarFieldEnum]
    ): Image
    findManyImage(
      where: ImageWhereInput
      orderBy: [ImageOrderByWithRelationInput]
      cursor: ImageWhereUniqueInput
      take: Int
      skip: Int
      distinct: [ImageScalarFieldEnum]
    ): [Image!]
    findManyImageCount(
      where: ImageWhereInput
      orderBy: [ImageOrderByWithRelationInput]
      cursor: ImageWhereUniqueInput
      take: Int
      skip: Int
      distinct: [ImageScalarFieldEnum]
    ): Int!
    aggregateImage(
      where: ImageWhereInput
      orderBy: [ImageOrderByWithRelationInput]
      cursor: ImageWhereUniqueInput
      take: Int
      skip: Int
    ): AggregateImage
  }

  type Mutation {
    createOneImage(data: ImageCreateInput!): Image!
    updateOneImage(
      data: ImageUpdateInput!
      where: ImageWhereUniqueInput!
    ): Image!
    deleteOneImage(where: ImageWhereUniqueInput!): Image
    upsertOneImage(
      where: ImageWhereUniqueInput!
      create: ImageCreateInput!
      update: ImageUpdateInput!
    ): Image
    deleteManyImage(where: ImageWhereInput): BatchPayload
    updateManyImage(
      data: ImageUpdateManyMutationInput!
      where: ImageWhereInput
    ): BatchPayload
  }
`

module.exports = {
  Image,
}
