/**
 * Closures capture references, not values. This example has a mutation trap most seniors miss. Predict output and explain what went wrong — then fix it in two different ways.
function makeMultipliers() {
  const multipliers = [];

  for (var i = 1; i <= 3; i++) {
    multipliers.push(function(x) {
      return x * i;
    });
  }

  return multipliers;
}

const [double, triple, quad] = makeMultipliers();
console.log(double(5));  // ?
console.log(triple(5));  // ?
console.log(quad(5));    // ?


Senior expectation: Must explain that all 3 functions close over the same var i binding. After the loop, i is 4. The "double/triple/quad" naming is misleading — all three behave identically. Fixes: IIFE to snapshot value, or replace var with let.
double(5)
20
Not 10 — all closures share the same i, which is 4 after the loop ends
triple(5)
20
Same — i is still 4
quad(5)
20
Same — all three return 5 * 4 = 20
Fix 1 — IIFE to snapshot: multipliers.push(((j) => (x) => x * j)(i)) — immediately invokes and captures i by value into j. Fix 2 — switch var to let: let creates a new binding per iteration, so each closure captures its own independent i. The IIFE fix is the pattern to know when you're stuck with var (e.g. legacy code). In any modern codebase, let is the correct answer.
Interview signal: if you only give the let fix, the interviewer will say "now do it without changing var" — know both.


Draw out the scope chain for the following code. At the moment grandchild() executes, how does JS resolve the variable secret? What happens if you add let secret = 'grandchild' inside grandchild — does that change anything for the outer scopes?
const secret = 'global';

function parent() {
  const secret = 'parent';

  function child() {
    function grandchild() {
      console.log(secret); // which secret?
    }
    grandchild();
  }

  child();
}

parent();

Senior expectation: Must walk the chain step by step — grandchild scope → child scope (no secret) → parent scope (found: 'parent'). Must explain shadowing: adding let inside grandchild creates a new binding that shadows parent's secret but does NOT mutate it. Scopes are one-directional — inner changes never affect outer bindings.
GLOBAL SCOPE
secret = 'global'
PARENT SCOPE
secret = 'parent' ← found here, lookup stops
CHILD SCOPE
(no secret binding)
GRANDCHILD SCOPE
(no secret binding) → walks up chain
Output: 'parent'. The engine looks for secret in grandchild's own scope — not found. Walks up to child — not found. Walks up to parent — found 'parent'. Stops. Never reaches global.

If you add let secret = 'grandchild' inside grandchild: a new binding is created in grandchild's scope. Lookup now finds it immediately and stops. The outer secret bindings in parent and global are completely unaffected — shadowing is one-directional and non-destructive. This is why variable shadowing is safe but confusing.
 */