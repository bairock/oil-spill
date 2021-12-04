const express = require('express')
const moment = require('moment')

const { prisma } = require('../../utils/context')
const { upload, deleteFile } = require('../../utils/multer')

const router = express.Router()

router.post('/image', upload.single('image'), async (req, res) => {
    return res.json({
        filename: req.file.filename
    })
})

// ML get images
router.get('/images', async (req, res) => {
    const images = await prisma.image.findMany({
        where: {
            status: { equals: 0 }
        }
    })
    return res.json(images)
})

// ML update one image
router.put('/images/:id', upload.single('image'), async (req, res) => {
    if (!req.file) return res.sendStatus(400)
    const { id } = req.params
    const { status, date, cornerCoordinates } = req.body
    const { filename } = req.file

    const existImage = await prisma.image.findUnique({ where: { id } })
    if (!existImage) return res.sendStatus(404)

    await deleteFile(existImage.name)

    await prisma.image.update({
        where: { id },
        data: {
            name: { set: filename },
            date: { set: moment(date).toISOString() },
            cornerCoordinates,
            status: { set: parseInt(status) }
        }
    })

    return res.json({
        id: target.id
    })
})

// API for Satellite
router.post('/targets', upload.single('image'), async (req, res) => {
    const { filename } = req.file
    const { lng, ltd, date, cornerCoordinates } = req.body

    let cornerCoordinatesArr = JSON.parse(cornerCoordinates)

    const exist = await prisma.target.findFirst({
        where: {
            latitude: { equals: ltd },
            longitude: { equals: lng }
        }
    })

    if (exist) {
        const target = await prisma.target.update({
            where: { id: exist.id },
            data: {
                images: {
                    create: {
                        name: filename,
                        date: moment(date).toISOString(),
                        cornerCoordinates: {
                            1: cornerCoordinatesArr[0],
                            2: cornerCoordinatesArr[1],
                            3: cornerCoordinatesArr[2],
                            4: cornerCoordinatesArr[3]
                        }
                    }
                }
            }
        })
        return res.json({
            id: target.id
        })
    }

    const target = await prisma.target.create({
        data: {
            latitude: ltd,
            longitude: lng,
            name: filename,
            images: {
                create: {
                    name: filename,
                    date: moment(date).toISOString(),
                    cornerCoordinates: {
                        1: cornerCoordinatesArr[0],
                        2: cornerCoordinatesArr[1],
                        3: cornerCoordinatesArr[2],
                        4: cornerCoordinatesArr[3]
                    }
                }
            }
        }
    })

    return res.json({
        id: target.id
    })
})

// [[106.07531,59.537326],[106.962456,59.537326],[106.962456,59.236616],[106.07531,59.236616]]

module.exports = router
