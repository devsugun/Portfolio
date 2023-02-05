const fs = require('fs');
const path = require('path');

// import { executeOlistbrCrudOperations } from './olistbrCrud.js';

function config() {
  const envPath = path.join(__dirname, '.env');
  const envData = fs.readFileSync(envPath, 'utf-8');
  const envVars = envData.split('\n');

  envVars.forEach(envVar => {
    const [key, value] = envVar.split('=');
    process.env[key] = value;
  });
}

config();
console.log(process.env);
