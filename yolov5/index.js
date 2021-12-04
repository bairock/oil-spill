const { PythonShell } = require('python-shell')
const fs = require('fs')
const download = require('download')
const { GraphQLClient, gql } = require('graphql-request')


const findManyImageQuery = gql`
    {
        findManyImage(where: { status: { equals: 0 } } ) {
            id
            name
        }
    }
`

const updateOneImageMutation = gql`
    mutation($where: ImageWhereUniqueInput! $data: ImageUpdateInput!) {
        updateOneImage(where: $where data: $data) {
            id
        }
    }
`

const client = new GraphQLClient('http://89.108.83.85/graphql')
const uploads = 'http://89.108.83.85/uploads'

const runDetect = async (value, id) => {
    if (fs.existsSync('./runs/detect')) {
        await fs.rmSync('./runs/detect', { recursive: true })
    }

    await download(value, './images', {
        filename: '1.jpg'
    })

    const options = {
        mode: 'text',
        args: [
            '--source',
            './images/1.jpg',
            '--weights',
            'oil.pt',
            '--conf',
            '0.4',
            // '--hide-conf',
            '--hide-labels'
        ]
    }
    PythonShell.run('detect.py', options, async (err, result) => {
        if (err) {
            console.log('err', id)
            setTimeout(() => start(), 15000)
        } else {
            if (result) {
                const variables = {
                    where: {
                        id
                    },
                    data: {
                        status: {
                            set: 2
                        }
                    }
                }
                const data = await client.request(updateOneImageMutation, variables)
                console.log(data)
            } else {
                const variables = {
                    where: {
                        id
                    },
                    data: {
                        status: {
                            set: 1
                        }
                    }
                }
                const data = await client.request(updateOneImageMutation, variables)
                console.log(data)
            }
        }
    })
}

const start = async () => {
    const { findManyImage } = await client.request(findManyImageQuery)


    for (const { id, name } of findManyImage) {
        const url = `${uploads}/${name}`
        await runDetect(url, id)
    }
    setTimeout(() => start(), 15000)
}

start()