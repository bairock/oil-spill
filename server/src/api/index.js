const express = require('express')
const moment = require('moment')

const { prisma } = require('../../utils/context')
const { upload, deleteFile } = require('../../utils/multer')

const router = express.Router()

// ML get targets
router.get('/targets', async (req, res) => {
    const { status } = req.query
    const targets = await prisma.target.findMany({
        where: {
            status: status ? parseInt(status) : undefined
        }
    })
    return res.json(targets)
})

// ML update one target
router.put('/targets/:id', upload.single('image'), async (req, res) => {
    if (!req.file) return res.sendStatus(400)
    const { id } = req.params
    const { status } = req.body
    const { filename } = req.file

    const target = await prisma.target.findUnique({ where: { id } })
    if (!target) return res.sendStatus(404)

    if (target.image) {
        deleteFile(target.image)
    }

    await prisma.target.update({
        where: { id },
        data: {
            status: parseInt(status),
            image: filename
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

    const target = await prisma.target.create({
        data: {
            latitude: ltd,
            longitude: lng,
            date: moment(date).toISOString(),
            cornerCoordinates: {
                1: cornerCoordinatesArr[0],
                2: cornerCoordinatesArr[1],
                3: cornerCoordinatesArr[2],
                4: cornerCoordinatesArr[3]
            },
            image: filename
        }
    })

    return res.json({
        id: target.id
    })
})

module.exports = router
