const multer = require('multer')
const path = require('path')
const fs = require('fs')

const destineDir = path.join(__dirname, '../../', 'public')

if (!fs.existsSync(destineDir)) {
  fs.mkdirSync(destineDir)
}

const storage = multer.diskStorage({
  // Directories
  destination(req, file, cb) {
    cb(null, destineDir)
  },

  // filenames
  filename(req, file, cb) {
    const name = path.parse(file.originalname).name
    const created = new Date()
    const date = created.toISOString().split('T')[0]
    const time = created.toLocaleTimeString().replace(/:/g, '-')

    cb(null, `${date}_${time}_${req.body.brand}-${req.body.name}-${name}`)
  },
})

// Allowed formats
const fileFilter = (req, file, cb) => {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return cb(new Error('Only images are allowed'))
  }
  cb(null, true)
}

// Allowed files
const limits = {
  fileSize: 1024 * 1024,
}

let upload = multer({
  storage,
  fileFilter,
  limits,
}).array('image', 4)

module.exports = (req, res, next) =>
  upload(req, res, (error) => {
    if (error) {
      return next({
        success: false,
        error,
      })
    }
    next()
  })
