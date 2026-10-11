import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 80 * 1024,
    files: 1,
    fields: 1,
  },
});

export default upload;
