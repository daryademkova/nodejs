function* testGenerator() {
  yield 'Yura';
  yield 'Egor';
  yield 'Vova';
}

const myGenerator = testGenerator();

console.log(myGenerator.next());
console.log(myGenerator.next());
console.log(myGenerator.next());
console.log(myGenerator.next());
