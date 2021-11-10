import _ from 'lodash';

const stringView = (value, dp) => {
  const indent = ' ';
  const iter = (valueCurrent, depth) => {
    if (!_.isObject(valueCurrent)) {
      return `${valueCurrent}`;
    }

    const result = Object
      .entries(valueCurrent)
      .map(([key, val]) => `${indent.repeat(depth + 8)}${key}: ${iter(val, depth + 4)}`);
    return ['{', ...result, `${indent.repeat(depth + 4)}}`].join('\n');
  };
  return iter(value, dp);
};

const transformTree = (data) => {
  const indent = ' ';

  const iter = (tree, depth) => tree.map((node) => {
    console.log(node.type);
    switch (node.type) {
      case 'add':
        return `${indent.repeat(depth + 2)}+ ${node.key}: ${stringView(node.val, depth)}\n`;
      case 'del':
        return `${indent.repeat(depth + 2)}- ${node.key}: ${stringView(node.val, depth)}\n`;
      case 'same':
        return ` ${indent.repeat(depth + 2)} ${node.key}: ${stringView(node.val, depth)}\n`;
      case 'change':
        return `${indent.repeat(depth + 2)}- ${node.key}: ${stringView(node.value1, depth)}\n${indent.repeat(depth + 2)}+ ${node.key}: ${stringView(node.value2, depth)}\n`;
      case 'recursive':
        return `${indent.repeat(depth + 4)}${node.key}: {\n${iter(node.children, depth + 4).join('')}${indent.repeat(depth + 4)}}\n`;
      default:
        throw new Error('Unknown node status!');
    }
  });
  return `{\n${iter(data, 0).join('')}}`;
};

export default transformTree;
