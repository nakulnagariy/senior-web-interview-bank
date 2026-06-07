// Buggy: Event pooling issue (React <17)
function BuggyButton() {
  function handleClick(e) {
    setTimeout(() => {
      alert(e.type); // e.type may be null or undefined
    }, 100);
  }
  return <button onClick={handleClick}>Click me</button>;
}

// Fixed: Using event.persist()
function FixedButton() {
  function handleClick(e) {
    e.persist();
    setTimeout(() => {
      alert(e.type); // e.type is preserved
    }, 100);
  }
  return <button onClick={handleClick}>Click me</button>;
}