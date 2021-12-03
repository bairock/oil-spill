import gql from "graphql-tag"

export const FIND_MANY_TARGET = gql`
    query(
        $where: TargetWhereInput
        $orderBy: [TargetOrderByWithRelationInput]
        $cursor: TargetWhereUniqueInput
        $take: Int
        $skip: Int
        $distinct: [TargetScalarFieldEnum]
    ){
        findManyTarget(
            where: $where
            orderBy: $orderBy
            cursor: $cursor
            take: $take
            skip: $skip
            distinct: $distinct
        ){
            id
            createdAt
            updatedAt
            images(orderBy: {date: desc}) {
                id
                date
                name
                cornerCoordinates
                status
            }
            name
            latitude
            longitude
        }
    }
`