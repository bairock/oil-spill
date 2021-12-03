import { useQuery } from '@apollo/client'

import { FIND_ME_USER } from '../gqls'

export const useUser = (params = {}) => {
    const { onCompleted = () => { }, onError = () => { }, fetchPolicy = 'network-only' } = params
    const { data, loading, error } = useQuery(FIND_ME_USER,{
        onCompleted,
        onError,
        fetchPolicy
    })

    const user = data ? data.findMeUser : null

    return {
        loading,
        error,
        user
    }
}