import { createInterface } from 'readline/promises';
import { resolve } from 'path';
import * as fs from './commands/fs.js';
import * as nwd from './commands/nwd.js';
import { operatingSystem } from './commands/os.js';
import { calculateHash } from './commands/hash.js';
import { compress } from './commands/compress.js';
import { decompress } from './commands/decompress.js';

export const app = (username, homedir) => {
 let curDir = homedir;

 const rl = createInterface({
     input: process.stdin,
     output: process.stdout
 });

 process.on('exit', () => console.log(`\nThank you for using File Manager, ${username}, goodbye !`));

 process.on('SIGINT', () => {
     process.exit();
 });

 rl.on('line', async (input) => {
     if (input === '.exit') {
         process.exit();
     }
     else if (input === 'up') await up();
     else if (input.startsWith('cd ')) {
         const newPath = input.substring(3).trim();
         const newDir = await cd(newPath);
         if (newPath) curDir = newDir;
     }
     else if (input === 'ls') {
         await nwd.ls(curDir); 
     }
     else if (input.startsWith('cat ')) {
         const path = input.substring(4).trim();
         await fs.cat(path);
     }
     else if (input.startsWith('add ')) {
         const filePath = input.substring(4).trim();
         await fs.add(resolve(curDir, filePath));
     }
     else if (input.startsWith('rn ')) {
         const args = input.substring(3).trim().split(' ');
         if (args.length === 2) {
             const filePath = resolve(curDir, args[0]);
             const properFileName = args[1];
             await fs.rn(filePath, properFileName);
         }
     }
     else if (input.startsWith('cp ')) {
         const args = input.substring(3).trim().split(' ');
         if (args.length === 2) {
             const sourcePath = resolve(curDir, args[0]);
             const destinationDir = resolve(curDir, args[1]);
             await fs.cp(sourcePath, destinationDir);
         }
     }
     else if (input.startsWith('mv ')) {
         const args = input.substring(3).trim().split(' ');
         if (args.length === 2) {
             const sourcePath = resolve(curDir, args[0]);
             const destinationDir = resolve(curDir, args[1]);
             await fs.mv(sourcePath, destinationDir);
         }
     }
     else if (input.startsWith('rm ')) {
         const filePath = input.substring(3).trim();
         await fs.rm(resolve(curDir, filePath));
     }
     else if (input.startsWith('os ')) {
         const arg = input.substring(3).trim();
         operatingSystem(arg);
     }
     else if (input.startsWith('hash ')) {
         const path = input.substring(5).trim();
         calculateHash(path);
     }
     else if (input.startsWith('compress ')) {
         const args = input.substring(9).trim().split(' ');
         if (args.length === 2) {
          const sourcePath = resolve(curDir, args[0]);
          const destinationDir = resolve(curDir, args[1]);
          await compress(sourcePath, destinationDir);
      }
     }
     else if (input.startsWith('decompress ')) {
      const args = input.substring(11).trim().split(' ');
      if (args.length === 2) {
       const sourcePath = resolve(curDir, args[0]);
       const destinationDir = resolve(curDir, args[1]);
       await decompress(sourcePath, destinationDir);
   }
  } else console.error('Invalid input');
     console.log(`You are currently in ${curDir}`);
 });

 const up = async() => {
     try {
         curDir = resolve(curDir, '..');
         return curDir;
     } catch(error) {
         throw new Error(error);
     }
 }

 const cd = async(newDir) => {
     curDir = await nwd.cd(curDir, newDir);
     return curDir;
 };
}