import { access } from 'fs';
import { readFile } from 'fs/promises';
const { createHash } = await import('node:crypto');

const calculateHash = async (path) => {
 const hash = createHash('sha256');

 try {
    const file = await readFile(path);
    hash.update(file);

    const fileHash = hash.digest('hex');
    console.log(fileHash);
 } catch {
     console.log('Unable to calculate hash');
 }

 if (!(await access(path))) console.log('This file does not exist');
};

export { calculateHash };