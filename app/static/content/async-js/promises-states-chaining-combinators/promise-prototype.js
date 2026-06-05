/**
 * Implement a simplified MyPromise class from scratch that supports .then(), .catch(), chaining, and async resolution. You don't need full spec compliance — but it must handle the core cases correctly.

Great instinct. In an interview, the best response is to keep it simple, say what tradeoffs you are making, and implement only core behavior cleanly.

What I would say first (30-40 seconds):

I will implement a minimal state machine: pending, fulfilled, rejected.
I will queue callbacks while pending, and flush them asynchronously using queueMicrotask.
then will always return a new MyPromise for chaining.
I will propagate errors with try/catch around executor and handlers.
I am intentionally skipping full Promises/A+ edge cases, but will handle returned MyPromise values.
A practical interview-level implementation:

Quick demo cases to mention:

Success:
new MyPromise((res) => res(10)).then((v) => v + 5).then(console.log); // 15
Reject + catch:
new MyPromise((_, rej) => rej(new Error("fail"))).catch((e) => console.log(e.message));
Async resolve:
new MyPromise((res) => setTimeout(() => res("done"), 100)).then(console.log);
That is usually the right depth for this interview prompt: correct core behavior, not full spec complexity.

 */
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledQueue = [];
    this.rejectedQueue = [];

    const resolve = this.resolve.bind(this);
    const reject = this.reject.bind(this);

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  resolve(value) {
    if (this.state !== "pending") return;

    // Minimal chaining adoption for returned MyPromise
    if (value instanceof MyPromise) {
      return value.then(this.resolve.bind(this), this.reject.bind(this));
    }

    this.state = "fulfilled";
    this.value = value;

    queueMicrotask(() => {
      const queue = this.fulfilledQueue;
      this.fulfilledQueue = [];
      this.rejectedQueue = [];
      queue.forEach((fn) => fn(this.value));
    });
  }

  reject(reason) {
    if (this.state !== "pending") return;

    this.state = "rejected";
    this.reason = reason;

    queueMicrotask(() => {
      const queue = this.rejectedQueue;
      this.fulfilledQueue = [];
      this.rejectedQueue = [];
      queue.forEach((fn) => fn(this.reason));
    });
  }

  then(onFulfilled, onRejected) {
    const success = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    const failure =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    return new MyPromise((resolve, reject) => {
      const runSuccess = (value) => {
        queueMicrotask(() => {
          try {
            const result = success(value);
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      };

      const runFailure = (reason) => {
        queueMicrotask(() => {
          try {
            const result = failure(reason);
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === "fulfilled") runSuccess(this.value);
      else if (this.state === "rejected") runFailure(this.reason);
      else {
        this.fulfilledQueue.push(runSuccess);
        this.rejectedQueue.push(runFailure);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

new MyPromise((res) => res(10)).then((v) => v + 5).then(console.log); // 15

new MyPromise((_, rej) => rej(new Error("fail"))).catch((e) => console.log(e.message));

new MyPromise((res) => setTimeout(() => res("done"), 100)).then(console.log);