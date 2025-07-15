const InvariantError = require('../../exceptions/InvariantError');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const CoverValidator = {
  validateCoverFile: (file) => {
    if (!file || !file.hapi) {
      throw new InvariantError('File tidak ditemukan');
    }
    
    const contentType = file.hapi.headers['content-type'];
    if (!allowedMimeTypes.includes(contentType)) {
      throw new InvariantError('Berkas yang diunggah harus berupa gambar');
    }

    const contentLength = parseInt(file.hapi.headers['content-length'] || 0);
    if (contentLength > 512000) {
      throw new InvariantError('Ukuran file tidak boleh lebih dari 512000 bytes');
    }
  },
};

module.exports = CoverValidator;