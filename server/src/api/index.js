const express = require('express')
const moment = require('moment')

const { prisma } = require('../../utils/context')
const { upload } = require('../../utils/multer')

const router = express.Router()

// ML get targets
router.get('/targets', async (req, res) => {
    const { status } = req.query
    const targets = await prisma.target.findMany({
        where: {
            status: status ? parseInt(status) : undefined
        },
        select: {
            images: true
        }
    })
    return res.json(targets)
})

// ML update one target
router.put('/targets/:id', upload.single('image'), async (req, res) => {
    if (!req.file) return res.sendStatus(400)
    const { id } = req.params
    const { status, date, cornerCoordinates } = req.body
    const { filename } = req.file

    const target = await prisma.target.findUnique({ where: { id } })
    if (!target) return res.sendStatus(404)

    await prisma.target.update({
        where: { id },
        data: {
            images: {
                create: {
                    name: filename,
                    date: moment(date).toISOString(),
                    cornerCoordinates,
                    status: parseInt(status),
                }
            }
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
                        },
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
                    },
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
