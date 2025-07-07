const fs = require('fs');
const path = require('path');

exports.syncPhotos = async (req, res) => {
  try {
    const sourceDir = path.join(__dirname, '..', 'newUploads');
    const destDir = path.join(__dirname, '..', 'photos');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    const copied = [];

    files.forEach(file => {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);

      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        copied.push(file);
      }
    });

    return res.status(200).json({ message: 'Photos synchronized successfully', copied });
  } catch (error) {
    console.error('Error in syncPhotos:', error);
    return res.status(500).json({ message: 'Failed to synchronize photos' });
  }
};
