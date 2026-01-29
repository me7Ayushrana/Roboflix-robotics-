const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'public/sequence/ezgif-split-2');
const targetDir = path.join(__dirname, 'public/sequence');

// Move files and rename
if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.gif'));
    files.sort(); // Ensure 000, 001, 002 order

    files.forEach((file, index) => {
        const oldPath = path.join(sourceDir, file);
        const newFilename = `frame_${String(index).padStart(3, '0')}.gif`;
        const newPath = path.join(targetDir, newFilename);

        fs.renameSync(oldPath, newPath);
        console.log(`Renamed ${file} -> ${newFilename}`);
    });

    // Cleanup empty dir
    try {
        fs.rmdirSync(sourceDir);
    } catch (e) {
        // ignore
    }
}
