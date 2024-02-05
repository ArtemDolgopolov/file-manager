import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress } from 'zlib';

const compress = async (srcPath, destPath) => {
    try {
        const src = createReadStream(srcPath);
        const dest = createWriteStream(destPath);

        src.on('error', () => {
            console.error('No such file');
        });

        dest.on('error', () => {
            console.error('Destination should be archive');
        });

        const compressFile = createBrotliCompress({ brotli: true });

        src.pipe(compressFile).pipe(dest);

        await new Promise((resolve, reject) => {
            src.on("end", () => resolve());
            src.on("error", () => reject());
        });
    } catch (error) {
        if (error && error.message && (!error.message.includes('No such file') && !error.message.includes('Destination should be archive'))) {
            console.error('Compression error:', error);
        }
    }
}

export { compress };