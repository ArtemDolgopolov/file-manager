import os from 'os';

const operatingSystem = (arg) => {
  if (arg === '--EOL') {
    const eol = os.EOL;
    console.log(`End-of-line: ${JSON.stringify(eol)}`);
  } else if (arg === '--cpus') {
    const cpus = os.cpus();
    console.log('CPUs info:');
    cpus.forEach((cpu, index) => {
      const model = cpu.model;
      const speed = cpu.speed / 1000;
      console.log(`CPU ${index + 1}: ${model} (${speed} GHz)`);
    });
  } else if (arg === '--homedir') {
    const homedir = os.homedir();
    console.log(`Home directory: ${homedir}`);
  } else if (arg === '--username') {
    const username = os.userInfo().username;
    console.log(`Username: ${username}`);
  } else if (arg === '--architecture') {
    const architecture = process.arch;
    console.log(`Architecture: ${architecture}`);
  } else {
    console.log(`Invalid input. Invalid argument ${arg}`);
  }
}

export { operatingSystem };