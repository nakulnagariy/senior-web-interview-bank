/**
 * Predict the exact output of each line. Then explain what the JS engine does during the creation phase vs. execution phase for each declaration.
 * console.log(a);        // line 1
console.log(b);        // line 2
console.log(c);        // line 3
console.log(foo());    // line 4
console.log(bar());    // line 5

var a = 1;
let b = 2;
const c = 3;
function foo() { return 'foo'; }
const bar = () => 'bar';



This is a classic loop closure trap. Predict output for both versions, then explain why they differ — and give two ways to fix version A without changing it to version B.

// Version A
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

// 3 3 3

// Version B
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0 1 2


Most engineers think TDZ only applies before the declaration line. This example shows a subtler trap. What does it output and why?

let x = 'global';

function test() {
  console.log(x);   // what prints here?
  let x = 'local';
  console.log(x);
}

test();

Senior expectation: Must know that let inside a block SHADOWS the outer binding from the TOP of that block — the TDZ is NOT relative to the outer variable. The function body is the block, so line 1 of test() is already in TDZ for the local x.
log 1
ReferenceError
The local let x shadows global x from start of function block. Accessing before declaration = TDZ error.
log 2
never reached
ReferenceError thrown on line 1 halts execution
This is the most common senior interview stumble. People assume console.log(x) would print 'global' because the let declaration is below it. But the JS engine hoists the let x to the top of its scope (the function body) immediately, creating a TDZ from the function start to the let x = 'local' line. The outer x is completely unreachable inside this block from the start. This is why TDZ exists — to prevent using a binding before you initialize it.


A junior engineer asks: "If let and const are also hoisted, why do we say they're NOT hoisted? Aren't they hoisted the same as var?" How do you explain this precisely without dumbing it down?

Senior expectation: Must not conflate hoisting (binding registration) with initialization. Must use spec-accurate language: all declarations are hoisted — what differs is the initialization value and timing. Should mention the V8/spec term "uninitialized binding".
All three — var, let, const — are hoisted in the sense that the JS engine registers their binding in the scope during the creation phase before any code runs. The difference is what happens at registration time:

• var: hoisted AND initialized to undefined immediately. Accessible from line 1 of its scope.
• let/const: hoisted AND left as an "uninitialized binding" — this uninitialized state IS the TDZ. Any read or write before the declaration line throws a ReferenceError.

So the popular statement "let/const are not hoisted" is technically wrong — what people mean is "let/const are not initialized during hoisting." The binding exists in memory; you just can't touch it. You can prove let is hoisted: typeof x inside a block with let x below it throws ReferenceError — if x were truly not hoisted, typeof would safely return 'undefined' as it does for completely undeclared variables.
Interviewer proof-point: typeof undeclaredVar → 'undefined' (no error). typeof x where let x is below → ReferenceError. This proves the binding exists (is hoisted) but is uninitialized.

Function declarations vs. function expressions — predict exact output and explain the hoisting difference between them in this mixed scenario.
console.log(typeof alpha);   // ?
console.log(typeof beta);    // ?
console.log(typeof gamma);   // ?

var alpha = function() {};
let beta = function() {};
function gamma() {}

Hide answer
Senior expectation: Must differentiate function declarations (fully hoisted) from function expressions (follow their variable's hoisting rules). typeof with TDZ is the key trap — it does NOT return 'undefined' for let/const, it throws.
alpha
'undefined'
var alpha hoisted and initialized to undefined. typeof undefined → 'undefined'
beta
ReferenceError
let beta is in TDZ — typeof does NOT skip TDZ for let/const
gamma
'function'
function declaration fully hoisted — body available immediately
The critical distinction: typeof is normally "safe" for undeclared variables (returns 'undefined'). But it is NOT safe for let/const variables in TDZ — it throws ReferenceError. This breaks a common defensive coding pattern. The function expression assigned to beta is irrelevant — the hoisting behavior is determined entirely by the let keyword, not by what's on the right-hand side of the assignment.

Q6
architecture
must-know
Senior scenario: You're reviewing a PR and see this pattern used throughout a large React codebase — module-level var declarations being used as feature flags. What specific hoisting-related risks does this introduce, and how would you refactor it?
// featureFlags.js (module level)
var isNewDashboardEnabled = false;

export function initFlags(config) {
  isNewDashboardEnabled = config.newDashboard;
}

export function useNewDashboard() {
  return isNewDashboardEnabled;
}

Hide answer
Senior expectation: Must identify temporal coupling (consumers can call useNewDashboard before initFlags), var mutability risk, and module singleton side effects. Should recommend const + module initialization pattern or a proper feature flag service.
Risks with var here:

1. Mutable state with no enforcement — var can be re-declared and re-assigned anywhere that imports this module. Any code can accidentally write isNewDashboardEnabled = true bypassing initFlags.

2. Temporal coupling — if a component calls useNewDashboard() before initFlags() runs (e.g. during module evaluation ordering), it silently gets false with no error. var's undefined-initialize actually makes this worse — it won't even throw.

3. Module singleton — this mutable var is shared across every import in the app. A unit test that mutates it will bleed state into the next test.

Refactor: use a closure-based or class-based flag service with initialization guard: let initialized = false; const flags = Object.freeze({...}). In production, use a proper feature flag SDK (LaunchDarkly, Unleash) that handles initialization lifecycle, default values, and async loading cleanly. If keeping this module pattern, at minimum switch to let and throw if useNewDashboard is called before initFlags.
 */

