# Event Delegation, Bubbling, and Capturing

## Event Bubbling
- When an event occurs on an element, it first runs handlers on that element, then on its parent, then up the DOM tree.
- Default phase for most events in JavaScript.
- Example: Clicking a button inside a div triggers the button's handler, then the div's handler.

## Event Capturing (Trickling)
- The event starts from the root and goes down to the target element.
- Handlers can be registered for the capturing phase by passing `true` as the third argument to `addEventListener`.
- Example: `element.addEventListener('click', handler, true)`

## Event Delegation
- Attaching a single event handler to a parent element instead of multiple children.
- Uses event bubbling to handle events from child elements.
- Useful for dynamic lists, improved performance, and less memory usage.

## Example

```js
// Delegation: handle all clicks on a list
document.getElementById('list').addEventListener('click', function(e) {
  if (e.target.matches('li')) {
    console.log('List item clicked:', e.target.textContent);
  }
});
```
### Summary
- Bubbling: Event flows up from target to root.
- Capturing: Event flows down from root to target.
- Delegation: Use bubbling to handle many child events with one parent handler.