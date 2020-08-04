function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Поддерживаются только числовые аргументы');
  }
  return a + b;
}

module.exports = sum;
