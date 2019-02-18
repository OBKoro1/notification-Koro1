// 检查数据格式
const checkData = (type, data) => {
  if (!type || !data) return false;
  if (type === 'String') {
    return typeof data === 'string'
  } else if (type === 'Object') {
    return Object.prototype.toString.call(data) === '[object Object]'
  } else if (type === 'number') {
    return typeof data === 'number'
  } else if (type === 'function') {
    return Object.prototype.toString.call(data) === '[object Function]'
  } else {
    return false;
  }
};

// 搜索数组对象
const searchArrObj = (arr, key, value) => {
  return arr.findIndex(item => {
    return item[key] === value;
  });
};
export default { checkData, searchArrObj };
