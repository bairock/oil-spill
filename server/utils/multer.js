const multer = require('multer')
const fs = require('fs')
const { nanoid } = require('nanoid')

const destination = `${__dirname}/../uploads`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destination)
    },
    filename: async function (req, file, cb) {
        const randomName = nanoid()
        const extension = file.originalname.split('.').pop()
        const filename = `${randomName}.${extension}`
        cb(null, filename)
    }
})

const deleteFile = (filename) => {
    const path = `${destination}/${filename}`
    fs.unlink(path, () => {})
}

const upload = multer({ storage })

module.exports = {
    upload,
    deleteFile
}
