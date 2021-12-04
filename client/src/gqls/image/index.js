import gql from 'graphql-tag'

export const CREATE_ONE_IMAGE = gql`
    mutation(
        $data: ImageCreateInput!
    ){
        createOneImage(
            data: $data
        ){
            id
            date
            name
            cornerCoordinates
            status
        }
    }
`