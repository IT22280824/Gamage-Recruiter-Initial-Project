// routes/mediaRoutes.js
const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  listMedia,
  getUserMedia,
  updateMedia,
  deleteMedia,
  downloadZip,
} = require('../controllers/mediaController');
const { upload } = require('../utils/multerCloudinary.js');
const { protect } = require('../middlewares/auth.js');

// All media routes require authentication
router.use(protect);

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', listMedia);
router.get('/user-media', getUserMedia); 
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
router.post('/download-zip', downloadZip);

module.exports = router;
