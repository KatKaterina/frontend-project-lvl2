import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const getData = (file) => fs.readFileSync(path.resolve(process.cwd(), file.trim()), 'utf-8');
const getFormat = (file) => path.extname(file).slice(1);

const getDiff = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

    /*const keys = _.sortBy([...keys1, ... keys2]);
    /*console.log(keys);*/
  const keys = _.sortBy(_.uniq([...keys1, ... keys2]));
  const result = keys.reduce((acc, key) => {
    const value1 = object1[key];
    const value2 = object2[key];
    if (!_.has(object1, key)) {
      acc.push(`+ ${key}: ${value2}`);
      /*acc.push({currentKey: key, value: value2, mark: '+'});*/
      return acc;
      /*return {currentKey: key, value: value2, mark: '+'};*/
    }
    if (!_.has(object2, key)) {
      acc.push(`- ${key}: ${value1}`);
      /*acc.push({currentKey: key, value: value1, mark: '-'});*/
      return acc;
      /*return {currentKey: key, value: value1, mark: '-'};*/
    }
    if (!_.isEqual(value1, value2)) {
      acc.push(`- ${key}: ${value1}`);
      acc.push(`+ ${key}: ${value2}`);
      /*acc.push({currentKey: key, value: value1, mark: '-'});
      acc.push({currentKey: key, value: value2, mark: '+'});*/
      return acc;
      /*return {currentKey: key, value: value1, valueNew: value2, mark: '<>'}*/
    }
    acc.push(`  ${key}: ${value1}`);
    /*acc.push({currentKey: key, value: value1, mark: '='});*/
    return acc;
    /*return {currentKey: key, value: value1, mark: '='}*/
  }, []);     
  return result;
}

const genDiff = (file1, file2) => {
  const dataFile1 = getData(file1);
  const dataFile2 = getData(file2);

  /*console.log(dataFile1);
  console.log(dataFile2);*/

  const obj1 = JSON.parse(dataFile1);
  const obj2 = JSON.parse(dataFile2);

  /*console.log(obj1);
  console.log(obj2);*/
    
  const result = getDiff(obj1, obj2);
  const resultToStr = result.join('\n');

  /*  console.log(result.join('\n'));
    
  /*printDiff(result);*/
  /*return JSON.stringify(result);*/
  return `{\n${resultToStr}\n}`;
};

export default genDiff;