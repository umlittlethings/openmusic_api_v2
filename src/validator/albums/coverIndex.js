const InvariantError = require('../../exceptions/InvariantError');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const CoverValidator = {
  validateCoverFile: (file) => {
    if (!file || !file.hapi || !allowedMimeTypes.includes(file.hapi.headers['content-type'])) {
      throw new InvariantError('Berkas yang diunggah harus berupa gambar');
    }
    if (file._data && file._data.length > 512000) {
      throw new InvariantError('Ukuran file tidak boleh lebih dari 512000 bytes');
    }
  },
};

module.exports = CoverValidator;