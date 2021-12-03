import gql from "graphql-tag"

export const FIND_ME_USER = gql`
    {
        findMeUser {
            id
            email
            name
        }
    }
`
export const LOGIN_USER = gql`
    mutation($data: LoginUserInput!){
        loginUser(data: $data){
            token
            user {
                id
                email
                name
            }
        }
    }
`