// Good key usage
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

// Bad key usage
function BadList({ items }) {
  return (
    <ul>
      {items.map((item, idx) => (
        <li key={idx}>{item.text}</li>
      ))}
    </ul>
  );
}

// Usage example:
// <GoodList items={[{id: 1, text: 'A'}, {id: 2, text: 'B'}]} />
// <BadList items={[{id: 1, text: 'A'}, {id: 2, text: 'B'}]} />
