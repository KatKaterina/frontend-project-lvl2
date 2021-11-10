import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers.js';
import getFormatedTree from './formatters/index.js';

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
  return result;
};

const genDiff = (file1, file2, formatName) => {
  const dataFile1 = getData(file1);
  const dataFile2 = getData(file2);
  const format1 = getFormat(file1);
  const format2 = getFormat(file2);
  const obj1 = parse(dataFile1, format1);
  const obj2 = parse(dataFile2, format2);
  const result = getDiff(obj1, obj2);
  return getFormatedTree(result, formatName);
};

export default genDiff;
