import { homedir } from 'os';

import { app } from "./app.js";
 
const args = process.argv;
const usernameArg = args.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.match(/--username=(.*)/)[1] : 'Anonymous';

const greeting = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
}

const yourHomeDir = () => {
 console.log(`You are currently in ${homedir}`);
}

greeting();

yourHomeDir();

app(username, homedir());