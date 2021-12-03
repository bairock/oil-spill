const { default: gql } = require('graphql-tag')

const Target = gql`
  type Target {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    images(
      where: ImageWhereInput
      orderBy: ImageOrderByWithRelationInput
      cursor: ImageWhereUniqueInput
      take: Int
      skip: Int
      distinct: ImageScalarFieldEnum
    ): [Image!]!
    latitude: String!
    longitude: String!
  }

  type Query {
    findUniqueTarget(where: TargetWhereUniqueInput!): Target
    findFirstTarget(
      where: TargetWhereInput
      orderBy: [TargetOrderByWithRelationInput]
      cursor: TargetWhereUniqueInput
      take: Int
      skip: Int
      distinct: [TargetScalarFieldEnum]
    ): Target
    findManyTarget(
      where: TargetWhereInput
      orderBy: [TargetOrderByWithRelationInput]
      cursor: TargetWhereUniqueInput
      take: Int
      skip: Int
      distinct: [TargetScalarFieldEnum]
    ): [Target!]
    findManyTargetCount(
      where: TargetWhereInput
      orderBy: [TargetOrderByWithRelationInput]
      cursor: TargetWhereUniqueInput
      take: Int
      skip: Int
      distinct: [TargetScalarFieldEnum]
    ): Int!
    aggregateTarget(
      where: TargetWhereInput
      orderBy: [TargetOrderByWithRelationInput]
      cursor: TargetWhereUniqueInput
      take: Int
      skip: Int
    ): AggregateTarget
  }

  type Mutation {
    createOneTarget(data: TargetCreateInput!): Target!
    updateOneTarget(
      data: TargetUpdateInput!
      where: TargetWhereUniqueInput!
    ): Target!
    deleteOneTarget(where: TargetWhereUniqueInput!): Target
    upsertOneTarget(
      where: TargetWhereUniqueInput!
      create: TargetCreateInput!
      update: TargetUpdateInput!
    ): Target
    deleteManyTarget(where: TargetWhereInput): BatchPayload
    updateManyTarget(
      data: TargetUpdateManyMutationInput!
      where: TargetWhereInput
    ): BatchPayload
  }
`

module.exports = {
  Target,
}
