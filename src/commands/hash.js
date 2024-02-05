import { stat } from 'fs/promises';
import { readFile } from 'fs/promises';
const { createHash } = await import('node:crypto');

const calculateHash = async (path) => {
    try {
        const pathStats = await stat(path);
        if (!pathStats.isFile()) {
            console.error('Unable to calculate hash: Path is not a file');
            return;
        }
    } catch (error) {
        console.error('Unable to calculate hash: file does not exist');
        return;
    }

    const hash = createHash('sha256');

    try {
        const fileContent = await readFile(path);
        hash.update(fileContent);

        const fileHash = hash.digest('hex');
        console.log(fileHash);
    } catch (error) {
        console.error('Unable to calculate hash: Error reading file');
    }
};

export { calculateHash };