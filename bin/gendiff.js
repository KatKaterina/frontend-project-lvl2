#!/usr/bin/env node
/*import { Command } from 'commander/esm.mjs';
const program = new Command();*/
import program from 'commander';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
program.parse();