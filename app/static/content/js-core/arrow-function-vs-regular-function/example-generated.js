// Arrow vs Regular Function: this binding
const obj = {
  value: 42,
  arrow: () => { console.log(this.value); }, // undefined
  regular: function() { console.log(this.value); } // 42
};
obj.arrow();
obj.regular();

// Arrow function cannot be used as constructor
const Arrow = () => {};
// new Arrow(); // TypeError: Arrow is not a constructor

// Regular function as constructor
function Regular() {
  this.value = 100;
}
const instance = new Regular();
console.log(instance.value); // 100

// Arrow function does not have arguments object
const arrowArgs = () => { console.log(arguments); }; // ReferenceError
function regularArgs() { console.log(arguments); }
regularArgs(1, 2, 3); // [1, 2, 3]