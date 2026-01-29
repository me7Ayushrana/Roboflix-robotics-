const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public/sequence');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generate() {
    for (let i = 0; i < 90; i++) {
        const svgImage = `
        <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#121212"/>
            <circle cx="960" cy="540" r="${(i + 1) * 5}" stroke="cyan" stroke-width="5" fill="none"/>
            <text x="50%" y="50%" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">Frame ${i}</text>
        </svg>
        `;

        const filename = `frame_${String(i).padStart(2, '0')}_delay-0.067s.webp`;
        await sharp(Buffer.from(svgImage))
            .webp()
            .toFile(path.join(outputDir, filename));

        console.log(`Generated ${filename}`);
    }
}

generate();
