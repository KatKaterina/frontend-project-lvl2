import _ from 'lodash';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

export default (data) => {
  const iter = (tree, property = undefined) => {
    const result = tree
      .filter((node) => node.type !== 'same')
      .map((node) => {
        const curentProperty = property ? `${property}.${node.key}` : node.key;
        switch (node.type) {
          case 'add':
            return `Property '${curentProperty}' was added with value: ${getValue(node.val)}`;
          case 'del':
            return `Property '${curentProperty}' was removed`;
          case 'change':
            return `Property '${curentProperty}' was updated. From ${getValue(node.value1)} to ${getValue(node.value2)}`;
          case 'recursive':
            return iter(node.children, curentProperty);
          default:
            throw new Error('Unknown node status!');
        }
      });
    return result.join('\n');
  };
  return `${iter(data)}`;
};
