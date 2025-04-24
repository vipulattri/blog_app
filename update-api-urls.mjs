#!/usr/bin/env node

/**
 * Script to verify API URL configuration in the project
 * Run this before deploying to Vercel to ensure proper API URL handling
 */

import { readFileSync, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

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

const CONFIG_FILE_PATH = './src/lib/config.ts';

async function main() {
  console.log(`${colors.bright}${colors.cyan}=== Vercel Deployment Helper ===${colors.reset}\n`);
  
  // Check if config file exists
  if (!existsSync(CONFIG_FILE_PATH)) {
    console.error(`${colors.red}Error: Config file ${CONFIG_FILE_PATH} not found.${colors.reset}`);
    console.log(`The API URL configuration file is missing. Please create it before deploying.`);
    process.exit(1);
  }
  
  // Read config file
  const configContent = readFileSync(CONFIG_FILE_PATH, 'utf8');
  
  // Check if Vercel URL is properly configured
  if (!configContent.includes('https://blog-app-ochre-delta-23.vercel.app')) {
    console.error(`${colors.red}Error: Vercel URL not properly configured in ${CONFIG_FILE_PATH}${colors.reset}`);
    console.log(`Please ensure the production URL is set to https://blog-app-ochre-delta-23.vercel.app`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Configuration looks good!${colors.reset}\n`);
  
  // Prompt for deployment
  console.log(`${colors.yellow}Ready to deploy to Vercel?${colors.reset}`);
  console.log('The following commands will be executed:');
  console.log(`${colors.cyan}1. npm run build${colors.reset} - Build the Next.js application`);
  console.log(`${colors.cyan}2. vercel --prod${colors.reset} - Deploy to Vercel production\n`);
  
  try {
    // Run build
    console.log(`${colors.bright}Running build...${colors.reset}`);
    const { stdout: buildOutput } = await execAsync('npm run build');
    console.log(buildOutput);
    console.log(`${colors.green}✓ Build completed successfully!${colors.reset}\n`);
    
    // Deploy to Vercel
    console.log(`${colors.bright}Deploying to Vercel...${colors.reset}`);
    console.log(`${colors.yellow}Note: You'll need to confirm the deployment in the terminal${colors.reset}\n`);
    
    // Use inherit to allow user input for Vercel CLI
    const child = exec('vercel --prod', { stdio: 'inherit' });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);
    
    child.on('exit', (code) => {
      if (code === 0) {
        console.log(`\n${colors.green}✓ Deployed successfully to Vercel!${colors.reset}`);
        console.log(`${colors.cyan}Your app should be live at: ${colors.bright}https://blog-app-ochre-delta-23.vercel.app${colors.reset}`);
      } else {
        console.error(`\n${colors.red}Deployment failed with code ${code}${colors.reset}`);
        console.log('Please check the error messages above and try again.');
      }
    });
    
  } catch (error) {
    console.error(`${colors.red}Error during deployment:${colors.reset}`, error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
}); 