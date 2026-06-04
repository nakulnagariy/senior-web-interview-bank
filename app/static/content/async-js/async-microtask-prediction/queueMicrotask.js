// console.log("Start");

// setTimeout(() => {
//   console.log("Timeout (Macrotask)");
// }, 0);

// Promise.resolve().then(() => {
//   console.log("Promise (Microtask)");
// });

// console.log("End");


function performAction() {
  console.log("1. Sync task start");

  queueMicrotask(() => {
    console.log("3. Microtask: Updating data before UI render");
  });

  console.log("2. Sync task end");
}

performAction();
