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
const file1 = getFixturePath('file1.json');
const file2 = getFixturePath('file2.json');

test('json', () => {
  expect(genDiff(file1, file2)).toEqual(resultJson);
});
