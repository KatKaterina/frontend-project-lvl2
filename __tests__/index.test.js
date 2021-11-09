import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@jest/globals';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const resultJson = readFile('resultJson.txt');
const resultPlain = readFile('resultPlain.txt');
const resultStylish = readFile('resultStylish.txt');

const file1 = getFixturePath('file1.json');
const file2 = getFixturePath('file2.json');

const yamlFile1 = getFixturePath('file1.yml');
const yamlFile2 = getFixturePath('file2.yml');

const formatNames = [['stylish', resultStylish], ['json', resultJson], ['plain', resultPlain]];

describe.each(formatNames)('test format:', (name, result) => {
  console.log(name, result);
  test(`json files -> ${name}`, () => {
    expect(genDiff(file1, file2, name)).toBe(result);
  });

  test(`yaml files -> ${name}`, () => {
    expect(genDiff(yamlFile1, yamlFile2, name)).toBe(result);
  });
});
