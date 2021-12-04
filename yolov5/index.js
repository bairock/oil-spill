const { PythonShell } = require('python-shell')
const fs = require('fs')
const download = require('download')
const { GraphQLClient, gql } = require('graphql-request')
const axios = require('axios')
const FormData = require('form-data')


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

const client = new GraphQLClient('http://xn--80aehalgul3asv.net/graphql')
const uploads = 'http://xn--80aehalgul3asv.net/uploads'

fs.watch('./runs/detect/', async (event, filename) => {
    console.log(filename, event)
    if (filename && event === 'change') {

        const formData = new FormData()
        formData.append('image', fs.createReadStream(`./runs/detect/${filename}/1.jpg`))
        const upload = await axios.post('http://xn--80aehalgul3asv.net/api/image', formData, {
            headers: formData.getHeaders()
        })
        if (upload && upload.data && upload.data.filename) {
            try {
                const variables = {
                    where: {
                        id: filename
                    },
                    data: {
                        name: {
                            set: upload.data.filename
                        }
                    }
                }
                const data = await client.request(updateOneImageMutation, variables)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
    }
})

const runDetect = async (value, id) => {
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
            '--name',
            id,
            '--conf',
            '0.7',
            // '--hide-conf',
            // '--hide-labels'
        ]
    }
    PythonShell.run('detect.py', options, async (err, result) => {
        if (err) {
            console.log('err', id)
            setTimeout(() => start(), 15000)
        } else {
            if (!result) {
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
                await client.request(updateOneImageMutation, variables)
            } else {
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
                await client.request(updateOneImageMutation, variables)
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