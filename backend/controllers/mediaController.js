const Media = require('../models/Media');
const archiver = require('archiver');
const { cloudinary } = require('../utils/multerCloudinary');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // workaround for fetch

// Upload media
const uploadMedia = async (req, res) => {
  const { title, description, tags } = req.body;
  if (!req.file) return res.status(400).json({ error: 'File missing' });
  const media = await Media.create({
    title,
    description,
    tags: tags?.split(',').map(s => s.trim()),
    url: req.file.path,
    public_id: req.file.filename,
    uploader: req.user.id
  });
  res.json({ media });
};
// List media with filters (for main gallery)
const listMedia = async (req, res) => {
  const { search, tags, shared } = req.query;
  let filter = { uploader: req.user.id };
  if (shared === 'true') filter.status = { $in: ['shared', 'public'] };
  if (search) filter.title = new RegExp(search, 'i');
  if (tags) filter.tags = { $in: tags.split(',').map(s => s.trim()) };
  const list = await Media.find(filter).sort('-createdAt');
  res.json({ media: list });
};

// Get all media uploaded by user (for profile page)
const getUserMedia = async (req, res) => {
  try {
    const mediaList = await Media.find({ uploader: req.user.id }).sort('-createdAt');
    res.json({ media: mediaList });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching media' });
  }
};

// Update media metadata
const updateMedia = async (req, res) => {
  const { id } = req.params;
  const { title, description, tags, status } = req.body;
  const media = await Media.findOne({ _id: id, uploader: req.user.id });
  if (!media) return res.status(404).json({ error: 'Not found' });
  Object.assign(media, {
    title,
    description,
    tags: tags.split(',').map(s => s.trim()),
    status
  });
  await media.save();
  res.json({ media });
};

// Delete media and Cloudinary file
const deleteMedia = async (req, res) => {
  const media = await Media.findOne({ _id: req.params.id, uploader: req.user.id });
  if (!media) return res.status(404).json({ error: 'Not found' });
  await cloudinary.uploader.destroy(media.public_id);
  await media.deleteOne();
  res.json({ success: true });
};

// Download selected media as ZIP
const downloadZip = async (req, res) => {
  const { ids } = req.body;
  const items = await Media.find({ _id: { $in: ids }, uploader: req.user.id });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=media.zip');

  const archive = archiver('zip');
  archive.on('error', err => res.status(500).send({ error: err.message }));
  archive.pipe(res);

  for (const m of items) {
    const response = await fetch(m.url);
    archive.append(response.body, { name: `${m.title}-${m._id}.jpg` });
  }

  archive.finalize();
};

module.exports = {
  uploadMedia,
  listMedia,
  getUserMedia,    // <-- export the new function
  updateMedia,
  deleteMedia,
  downloadZip
};