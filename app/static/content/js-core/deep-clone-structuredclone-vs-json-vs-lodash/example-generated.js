// Deep clone with structuredClone
const obj = { a: 1, b: { c: 2 } };
const clone1 = structuredClone(obj);

// Deep clone with JSON
const clone2 = JSON.parse(JSON.stringify(obj));

// Deep clone with lodash
const _ = require('lodash');
const clone3 = _.cloneDeep(obj);

// Edge cases
const circular = {};
circular.self = circular;
// structuredClone(circular); // OK
// JSON.parse(JSON.stringify(circular)); // Throws
// _.cloneDeep(circular); // OK

const withDate = { d: new Date() };
// structuredClone(withDate).d instanceof Date // true
// JSON.parse(JSON.stringify(withDate)).d // string
// _.cloneDeep(withDate).d instanceof Date // true