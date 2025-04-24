#!/usr/bin/env node

/**
 * Script to deploy the application to Vercel with the auth fixes
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import readline from 'readline';

const execAsync = promisify(exec);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log(`${colors.bright}${colors.cyan}=== Auth Fix Deployment Helper ===${colors.reset}\n`);
  
  console.log(`${colors.bright}This script will deploy your application to Vercel with the auth fixes.${colors.reset}\n`);
  console.log(`The following fixes have been applied:`);
  console.log(`${colors.green}1. Fixed cross-origin cookie settings in login, logout and register routes${colors.reset}`);
  console.log(`${colors.green}2. Updated Next.js config with CORS headers${colors.reset}`);
  console.log(`${colors.green}3. Improved API URL configuration for production${colors.reset}`);
  console.log(`${colors.green}4. Fixed Navigation component to properly check authentication status${colors.reset}\n`);
  
  const answer = await question(`${colors.yellow}Do you want to deploy these changes to Vercel? (y/n) ${colors.reset}`);
  
  if (answer.toLowerCase() !== 'y') {
    console.log(`${colors.red}Deployment cancelled.${colors.reset}`);
    rl.close();
    return;
  }
  
  try {
    // Add all changes
    console.log(`${colors.cyan}Adding all changes to git...${colors.reset}`);
    await execAsync('git add .');
    
    // Commit changes
    console.log(`${colors.cyan}Committing changes...${colors.reset}`);
    await execAsync('git commit -m "Fix authentication issues with cookies and CORS"');
    
    // Deploy to Vercel
    console.log(`${colors.cyan}Deploying to Vercel...${colors.reset}`);
    console.log(`${colors.yellow}Note: You'll need to confirm the deployment in the terminal${colors.reset}\n`);
    
    // Use spawn to allow user input for Vercel CLI
    const child = exec('vercel --prod', { stdio: 'inherit' });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    
    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`\n${colors.green}✓ Deployed successfully to Vercel!${colors.reset}`);
        console.log(`${colors.cyan}Your app should be live at: ${colors.bright}https://blog-app-ochre-delta-23.vercel.app${colors.reset}`);
        console.log(`\n${colors.yellow}Important: After deployment, you should test the login functionality at:${colors.reset}`);
        console.log(`${colors.bright}https://blog-app-ochre-delta-23.vercel.app/login${colors.reset}`);
        console.log(`\n${colors.yellow}Use these credentials:${colors.reset}`);
        console.log(`${colors.cyan}Username: ${colors.bright}Vipul${colors.reset}`);
        console.log(`${colors.cyan}Password: ${colors.bright}123456${colors.reset}`);
      } else {
        console.error(`\n${colors.red}Deployment failed with code ${code}${colors.reset}`);
        console.log('Please check the error messages above and try again.');
      }
      rl.close();
    });
    
  } catch (error) {
    console.error(`${colors.red}Error during deployment:${colors.reset}`, error);
    rl.close();
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  rl.close();
  process.exit(1);
}); 