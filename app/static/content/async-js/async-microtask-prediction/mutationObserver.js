// 1. Select the target node
const targetNode = document.getElementById("my-list");

// 2. Create the observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("Microtask: DOM change detected!", mutation.type);
  });
});

// 3. Start observing
observer.observe(targetNode, { childList: true });

// 4. Trigger a change
targetNode.appendChild(document.createElement("li"));
