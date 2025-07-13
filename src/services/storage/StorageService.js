const fs = require('fs');
const path = require('path');

class StorageService {
  constructor() {
    this._folder = path.resolve(__dirname, '../../../uploads/images');
    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + '-' + meta.filename.replace(/\s/g, '');
    const pathFile = `${this._folder}/${filename}`;
    const fileStream = fs.createWriteStream(pathFile);

    return new Promise((resolve, reject) => {
      fileStream.on('error', reject);
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;