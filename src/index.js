import fs from 'fs';

const files = fs.readdirSync('./src/template');
console.log(files);