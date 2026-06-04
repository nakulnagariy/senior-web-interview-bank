# Senior React Assessment: State, Closures, and Batching

This assessment evaluates a candidate's mastery of React's fiber architecture, asynchronous rendering, state batching boundaries, and lexical closures.

---

## Question 1: Synch vs Async State Updates & Batching
**Topics:** `useState` batching, Functional Updates, Render Lifecycles.

### Scenario
A developer wants to build a counter that increments by 1 immediately, and then adds an additional 2 after a 1-second delay based on the most recent state. They write the following code:

```jsx
import React, { useState } from 'react';

const DelayedCounter = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    // Attempted double increment
    setCount(count + 1);
    setCount(count + 1);

    // Delayed increment
    setTimeout(() => {
      setCount(count + 2);
    }, 1000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};
```

### Assessment Tasks
1. Identify **three distinct bugs** in the state update logic of `handleIncrement`.
2. Explain the architectural reasons (how React schedules renders and closures) behind why these bugs happen.
3. Provide a refactored `handleIncrement` function that works perfectly.

### Expected Senior Answers
1. **Bug 1 (State Batching):** The two immediate `setCount(count + 1)` calls use the snapshot of `count` from the current render context. React batches these updates, causing the second call to overwrite the first. The intermediate count becomes `1` instead of `2`.
2. **Bug 2 (Stale Closure):** The `setTimeout` callback creates a closure over the `count` variable from the specific render frame in which the button was clicked. If the user clicks the button multiple times quickly, the timeout will always add `2` to an outdated value of `count`.
3. **Bug 3 (State Overwrite):** Because the initial batching logic is flawed, the asynchronous timeout scheduled on the first click will evaluate and blindly overwrite any faster state changes that occurred in between.
4. **The Fix:** Every single state update must use the functional updater form (`prev => prev + n`) to look at the scheduled queue rather than the stale render snapshot.

#### Refactored Code
```jsx
const handleIncrement = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);

  setTimeout(() => {
    setCount(prev => prev + 2);
  }, 1000);
};
```

---

## Question 2: Automatic Batching & Event Loop Frames (React 18+)
**Topics:** React 18 Automatic Batching, Microtasks vs Macrotasks, Render Snapshots.

### Scenario
In React 18+, automatic batching handles state changes inside promises and timeouts. A developer writes a form handler expecting to read the freshly updated state variables immediately after an `await` keyword.

```jsx
import React, { useState } from 'react';

const FormLogger = () => {
  const [status, setStatus] = useState('idle');
  const [clickCount, setClickCount] = useState(0);

  const logSession = () => {
    console.log(`Status is ${status}, Clicked ${clickCount} times`);
  };

  const handleClick = async () => {
    setStatus('submitting');
    setClickCount(clickCount + 1);
    
    await mockNetworkRequest(); // Assume this takes 500ms

    setStatus('success');
    logSession(); 
  };

  return <button onClick={handleClick}>Submit</button>;
};
```

### Assessment Tasks
1. Assuming initial values are `'idle'` and `0`, what exactly prints to the console when the user clicks the button? Explain why.
2. How many times does this component re-render during the execution of `handleClick` under React 18?
3. Refactor the code to ensure the logging utility records the accurate updated data without forcing an anti-pattern synchronous render.

### Expected Senior Answers
1. **The Output:** It logs `"Status is idle, Clicked 0 times"`. 
2. **Why it happens:** Even though `logSession()` runs *after* the network request completes, the `handleClick` execution context belongs to the original render frame. `status` and `clickCount` are `const` variables bound to that specific render snapshot. They cannot change values mid-flight.
3. **Render Count:** It renders **two times**. 
   * *Render 1:* `setStatus('submitting')` and `setClickCount(1)` are automatically batched into one single render before the async await block releases the main thread.
   * *Render 2:* After the promise resolves, `setStatus('success')` schedules a second batch/render.
4. **The Fix:** Compute values locally or pass fresh parameters explicitly to the logging function. Do not treat state variables like mutable class properties.

#### Refactored Code
```jsx
const handleClick = async () => {
  const nextCount = clickCount + 1;
  setStatus('submitting');
  setClickCount(nextCount);
  
  await mockNetworkRequest();

  setStatus('success');
  // Pass variables directly to break dependency on stale closure
  logSession('success', nextCount); 
};
```

---

## Question 3: Data Fetching Race Conditions in Effects
**Topics:** `useEffect` cleanup, Async Race Conditions, State Synchronisation.

### Scenario
The following component loads profiles based on a `userId` prop and offers a manual refresh feature. It behaves erratically when users switch between profiles quickly.

```jsx
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>User: {user?.name}</p>}
      <button onClick={fetchUser}>Refresh</button>
    </div>
  );
};
```

### Assessment Tasks
1. Describe the precise sequence of events that triggers a **race condition** bug in this code.
2. Explain the issue with how `fetchUser` interacts with the `useEffect` dependency array and lexical scope.
3. Rewrite this component using cleanups to ensure slower asynchronous API responses never overwrite faster, newer data requests.

### Expected Senior Answers
1. **The Race Condition Scenario:** User opens profile `A`, then quickly jumps to profile `B`. Two network requests run concurrently. If request `A` encounters network latency and resolves *after* request `B`, `setUser(data)` for profile `A` runs last. The UI will stubbornly show profile `A` data even though the current `userId` prop is `B`.
2. **The Lexical Scope Issue:** `fetchUser` is created inside the component body. When it reads `userId`, it reads it from the scope available when the function was created. Putting `fetchUser` in the dependency array directly causes an infinite loop unless wrapped in `useCallback`.
3. **The Fix:** Use an boolean ignore flag initialized inside the effect and toggled during the effect's cleanup lifecycle.

#### Refactored Code
```jsx
import React, { useState, useEffect, useCallback } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Memoize to safely use outside effect and within the Refresh button click handler
  const fetchUser = useCallback(async (id, isMounted) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      if (isMounted()) {
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const checkActive = () => active;

    fetchUser(userId, checkActive);

    return () => {
      active = false; // Prevents updating state for an unmounted or stale effect iteration
    };
  }, [userId, fetchUser]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>User: {user?.name}</p>}
      <button onClick={() => fetchUser(userId, () => true)}>Refresh</button>
    </div>
  );
};
```

---

## Question 4: Custom Hooks & Stale Event Listeners
**Topics:** Event Listeners, Custom Hook boundaries, `useRef` mutable escape hatches.

### Scenario
A developer extracts mouse-tracking logic into a custom hook designed to trigger an action callback when the user clicks anywhere on the page, provided a certain score threshold is reached.

```jsx
import React, { useState, useEffect } from 'react';

const useGlobalClickAction = (callback) => {
  useEffect(() => {
    const handleGlobalClick = (event) => {
      callback(event);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []); // Empty dependency array
};

const Game = () => {
  const [score, setScore] = useState(0);

  useGlobalClickAction((event) => {
    console.log(`Global click captured! Current game score: ${score}`);
    if (score >= 5) {
      alert("Threshold reached!");
    }
  });

  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={() => setScore(prev => prev + 1)}>Increase Score</button>
    </div>
  );
};
```

### Assessment Tasks
1. Why does the `alert` never show up, no matter how high the user increases the score?
2. If we add `callback` to the dependency array of the custom hook's `useEffect`, what performance penalty or unexpected side effect gets introduced to the `Game` component?
3. How can we fix this custom hook using a `useRef` strategy so that the global event listener is added exactly once, yet always executes the fresh, up-to-date callback function?

### Expected Senior Answers
1. **The stale closure root cause:** The custom hook sets up an event listener once (`[]`). The callback passed initially references the `Game` component's first render context, where `score` is `0`. The global click listener traps this old version of the function forever.
2. **The dependency penalty:** If we add `callback` to the dependency array, the hook tears down and re-registers the window event listener on every render because the inline arrow function in `<Game />` is recreated each time.
3. **The `useRef` solution:** Use a mutable reference (`useRef`) to hold the latest callback closure and update it on every render without re-triggering listener registration.

#### Refactored Code
```jsx
import React, { useState, useEffect, useRef } from 'react';

const useGlobalClickAction = (callback) => {
  const savedCallback = useRef(callback);

  // Always keep the mutable reference pointing to the newest closure
  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const handleGlobalClick = (event) => {
      savedCallback.current(event);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []); // Safely mounts once
};
```

---

## Question 5: Breaking Closures via Architectural Redesign
**Topics:** Scaling beyond stale closures, `useReducer` vs deep state updates.

### Scenario
Complex components handling multiple cross-dependent state parameters routinely experience stale-closure bugs inside deep nested functions or long-lived asynchronous handlers.

```jsx
const complexReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'INCREMENT_METRIC':
      return { ...state, metric: state.metric + state.step };
    default:
      return state;
  }
};
```

### Assessment Tasks
1. Explain how replacing clustered `useState` calls with a unified `useReducer` solves stale-closure issues inside complex asynchronous functions or nested child components.
2. True or False: The `dispatch` function identity returned by `useReducer` is guaranteed stable across renders, and omitting it from dependency arrays does not cause stale loops. Explain the architectural reasoning.

### Expected Senior Answers
1. **Decoupling state expression:** `useReducer` separates action intent from state computation. Instead of asynchronous closures reading snapshot variables like `step` or `metric`, they dispatch a static action (for example `dispatch({ type: 'INCREMENT_METRIC' })`). React computes next state in the reducer using the freshest state snapshot.
2. **True:** React guarantees `dispatch` has stable identity across renders. Because the reference does not change, it can be safely used in callbacks/effects without causing stale closure risks.