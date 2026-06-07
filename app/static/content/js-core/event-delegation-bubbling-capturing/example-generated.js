// Event delegation for a list
document.getElementById('list').addEventListener('click', function(e) {
  if (e.target.matches('li')) {
    console.log('List item clicked:', e.target.textContent);
  }
});

// Bubbling vs capturing
const parent = document.getElementById('parent');
const child = document.getElementById('child');

parent.addEventListener('click', () => console.log('Parent bubble'));
parent.addEventListener('click', () => console.log('Parent capture'), true);
child.addEventListener('click', () => console.log('Child bubble'));
child.addEventListener('click', () => console.log('Child capture'), true);

// Clicking child logs:
// Parent capture
// Child capture
// Child bubble
// Parent bubble