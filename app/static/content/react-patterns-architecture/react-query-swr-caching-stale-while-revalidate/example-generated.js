// SWR example
import useSWR from 'swr';

function fetcher(url) {
  return fetch(url).then(res => res.json());
}

export function UserProfileSWR() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>User: {data.name}</div>;
}

// React Query example
import { useQuery } from '@tanstack/react-query';

async function fetchUser({ queryKey }) {
  const [, userId] = queryKey;
  const res = await fetch(`/api/user/${userId}`);
  return res.json();
}

export function UserProfileQuery({ userId }) {
  const { data, error, isLoading } = useQuery(['user', userId], fetchUser);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>User: {data.name}</div>;
}