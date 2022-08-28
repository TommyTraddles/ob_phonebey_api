const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    const name = file.originalname.split('.')[0]
    const created = new Date()
    const date = created.toISOString().split('T')[0]
    const time = created.toLocaleTimeString()

    cb(null, `${req.body.brand}-${req.body.name}_${name}-${date}-${time}`)
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024,
  },
})

const upload = multer({
  storage,
})

module.exports = upload.array('image', 4)
