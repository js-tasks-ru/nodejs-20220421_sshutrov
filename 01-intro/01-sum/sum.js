function sum(a, b) {
  if (typeof(a+b) == 'number') {
    return a+b;
  }
  throw new TypeError('Один из аргументов функции sum (или оба) не являются числом');
}

module.exports = sum;
