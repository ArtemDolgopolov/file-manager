import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'zlib';

const decompress = async (srcPath, destPath) => {
    try {
        const src = createReadStream(srcPath);
        const dest = createWriteStream(destPath);

        src.on('error', () => {
            console.error('No such file');
        });

        dest.on('error', () => {
            console.error('Destination should be file');
        });

        const decompressFile = createBrotliDecompress({ brotli: true });

        decompressFile.on('error', () => {});

        src.pipe(decompressFile).pipe(dest);

        await new Promise((resolve, reject) => {
            dest.on("finish", () => resolve());
            dest.on("error", () => reject());
        });
    } catch (error) {
        if (error && error.message && (!error.message.includes('No such file') && !error.message.includes('Destination should be file'))) {
            console.error('Decompression error:', error);
        }
    }
}

export { decompress };