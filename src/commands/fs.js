import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile, access, rename, rm as removeFile } from 'fs/promises';
import { basename, dirname, join, resolve } from 'path';
import { unlink } from 'fs/promises';

const cat = async(path) => {
    const fileToRead = createReadStream(path, 'utf-8');

    fileToRead.on('data', (chunk) => {
        process.stdout.write(chunk);
    });

    fileToRead.on('end', () => {
        process.stdout.write('\n');
    });
};

const add = async(filePath) => {
    try {
        await writeFile(filePath, '', {
            flag: 'wx'
        });
    } catch(error) {
        console.error('Failed to add file:', error.message);
    }
};

const rn = async(filePath, properFileName) => {
    const directory = dirname(filePath);
    const newFilePath = join(directory, properFileName);

    try {
        await rename(filePath, newFilePath);
    } catch(error) {
        if (error.code === 'EEXIST') {
            console.error('File with that name already exists');
        } else if (error.code === 'ENOENT') {
            console.error('No such original file');
        } else {
            console.error('Error during renaming a file:', error.message);
        }
    }
};

const cp = async(sourcePath, destinationDir) => {
    try {
        await access(sourcePath);
    } catch(error) {
        console.error('No such original file');
        return;
    }

    try {
        await access(destinationDir);
    } catch {
        console.error('No such destination directory');
        return;
    }

    const fileName = basename(sourcePath);
    const targetPath = resolve(destinationDir, fileName);

    try {
        await access(targetPath);
        console.error('File already exists in destination directory');
        return;
    } catch {
        const sourceStream = createReadStream(sourcePath);
        const destinationStream = createWriteStream(targetPath);

        sourceStream.pipe(destinationStream);
    }
};

const mv = async(sourcePath, destinationDir) => {
    try {
        await access(sourcePath);
    } catch(error) {
        console.error('No such original file');
        return;
    }

    try {
        await access(destinationDir);
    } catch {
        console.error('No such destination directory');
        return;
    }
    const fileName = basename(sourcePath);
    const targetPath = resolve(destinationDir, fileName);

    try {
        await access(targetPath);
        console.error('File already exists in destination directory');
        return;
    } catch {
        const sourceStream = createReadStream(sourcePath);
        const destinationStream = createWriteStream(targetPath);
        sourceStream.pipe(destinationStream);

        try {
            await removeFile(sourcePath);
        } catch {
            throw new Error('Error while deleting file');
        }
    };
}

const rm = async(filePath) => {
    try {
        await unlink(filePath);
    } catch(error) {
        console.error('Failed to remove file:', error.message);
    }
};

export { cat, add, rn, cp, mv, rm };