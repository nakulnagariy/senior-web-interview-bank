// Default binding
function foo() {
  console.log(this); // global or undefined (strict mode)
}
foo();

// Implicit binding
const obj = {
  name: 'obj',
  foo: function() { console.log(this.name); }
};
obj.foo(); // 'obj'

// Explicit binding
const obj2 = { name: 'obj2' };
obj.foo.call(obj2); // 'obj2'

// New binding
function Bar() {
  this.name = 'bar';
}
const b = new Bar();
console.log(b.name); // 'bar'

// Arrow function (lexical this)
const arrow = () => { console.log(this); };
arrow(); // inherits from enclosing scope

