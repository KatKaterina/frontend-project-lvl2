#!/usr/bin/env node

import program from 'commander';
import genDiff from '../src/index.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<file1> <file2>')
  .action((file1, file2, options) => console.log(genDiff(file1, file2, options.format)));
program.parse(process.argv);
