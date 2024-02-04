import { resolve, join } from 'path';
import { access, readdir, stat } from 'fs/promises';

const cd = async(curDir, newDir) => {
    try {
        const newPath = resolve(curDir, newDir);
        await access(newPath);
        console.log(`You are currently in ${newPath}`);
        return newPath;
    } catch {
        throw new Error('This directory does not exist')
    }
};

const ls = async(curDir) => {
    try {
        const files = await readdir(curDir, {
            withFileTypes: true
        });
        const items = [];

        for (const file of files) {
            const fileName = file.name;
            const filePath = join(curDir, fileName);
            const fileStats = await stat(filePath);

            if (fileStats.isDirectory()) {
                items.push({
                    Name: fileName,
                    Type: 'directory'
                });
            } else if (fileStats.isFile() && !fileStats.isSymbolicLink()) {
                const formattedFileName = `${fileName}`;
                items.push({
                    Name: formattedFileName,
                    Type: 'file'
                });
            }
        }

        const sortedItems = items.sort((a, b) => {
            if (a.Type === b.Type) {
                return a.Name.localeCompare(b.Name);
            } else if (a.Type === 'directory') {
                return - 1;
            } else {
                return 1;
            }
        });

        console.table(sortedItems);
    } catch(error) {
        throw new Error(`Directory read error ${error}`);
    }
}

export { cd, ls };