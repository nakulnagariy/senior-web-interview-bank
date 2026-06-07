// SSR example (Next.js)
export async function getServerSideProps(context) {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}

export default function SSRPage({ data }) {
  return <div>SSR Data: {JSON.stringify(data)}</div>;
}

// SSG example (Next.js)
export async function getStaticProps(context) {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}

export function SSGPage({ data }) {
  return <div>SSG Data: {JSON.stringify(data)}</div>;
}

// CSR example (Next.js)
import { useEffect, useState } from 'react';
export function CSRPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  return <div>CSR Data: {JSON.stringify(data)}</div>;
}