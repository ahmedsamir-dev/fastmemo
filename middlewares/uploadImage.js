const multer = require('multer');
const path = require('path');

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('herrrrrrrrre');
    cb(null, 'images/users');
  },

  filename: (req, file, cb) => {
    const filename = `User-${req.user._id}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const uploadUserPhoto = multer({
  storage: userStorage,
});

const noteSorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/notes');
  },

  filename: (req, file, cb) => {
    const filename = `Note-${req.params.id}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const uploadNoteImage = multer({
  storage: noteSorage,
});

module.exports = { uploadUserPhoto, uploadNoteImage };
