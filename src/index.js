import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers.js';
import stylish from './stylish.js';

const getData = (file) => fs.readFileSync(path.resolve(process.cwd(), file.trim()), 'utf-8');
const getFormat = (file) => path.extname(file).slice(1);

const getDiff = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  const keys = _.sortBy(_.union(keys1, keys2));
  const result = keys.map((key) => {
    const value1 = object1[key];
    const value2 = object2[key];

    if (!_.has(object1, key)) {
      return { key, val: value2, type: 'add' };
    }

    if (!_.has(object2, key)) {
      return { key, val: value1, type: 'del' };
    }

    if (_.isObject(value1) && _.isObject(value2)) {
      return { key, type: 'recursive', children: getDiff(value1, value2) };
    }

    if (value1 === value2) {
      return { key, val: value1, type: 'same' };
    }

    return {
      key, type: 'change', value1, value2,
    };
  });

  /* const keys = _.sortBy(_.uniq([...keys1, ...keys2]));
  const result = keys.reduce((acc, key) => {
    const value1 = object1[key];
    const value2 = object2[key];
    if (!_.has(object1, key)) {
      acc.push(`+ ${key}: ${value2}`);
      return acc;
    }
    if (!_.has(object2, key)) {
      acc.push(`- ${key}: ${value1}`);
      return acc;
    }
    if (!_.isEqual(value1, value2)) {
      acc.push(`- ${key}: ${value1}`);
      acc.push(`+ ${key}: ${value2}`);
      return acc;
    }
    acc.push(`  ${key}: ${value1}`);
    return acc;
  }, []); */
  return result;
};

const getFormatedTree = (tree, format) => {
  switch (format) {
    case 'json':
      return JSON.stringify(tree);
    default:
      return stylish(tree);
  }
};

const genDiff = (file1, file2, format) => {
  const dataFile1 = getData(file1);
  const dataFile2 = getData(file2);
  const format1 = getFormat(file1);
  const format2 = getFormat(file2);

  const obj1 = parse(dataFile1, format1);
  const obj2 = parse(dataFile2, format2);

  /* console.log(obj1);
  console.log(obj2); */
  const result = getDiff(obj1, obj2);
  /* console.log(result); */
  return getFormatedTree(result, format);
  /* const resultToStr = result.join('\n');
  return `{\n${resultToStr}\n}`; */
};

export default genDiff;
