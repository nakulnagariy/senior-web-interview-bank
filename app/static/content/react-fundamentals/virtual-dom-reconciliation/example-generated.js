// Example: React list rendering with keys for optimal reconciliation

import React from 'react';

function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

// Example usage:
const items = [
  { id: 1, text: 'Apple' },
  { id: 2, text: 'Banana' },
  { id: 3, text: 'Cherry' }
];

// <ItemList items={items} />