const multer = require("multer");
const { storage, storagePdf } = require("../cloudConfig");

// IMAGE UPLOAD (JPG, PNG)
const uploadImage = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG or PNG images allowed"));
    }
    cb(null, true);
  }
});

// PDF UPLOAD
const uploadPdf = multer({
  storage: storagePdf,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  }
});

module.exports = { uploadImage, uploadPdf };
