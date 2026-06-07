# Redux Toolkit: Slices, Thunks, RTK Query

## Slices
- A "slice" is a collection of Redux reducer logic and actions for a single feature, created with `createSlice`.
- Slices encapsulate state, reducers, and action creators, reducing boilerplate.

## Thunks
- Thunks are functions that handle async logic (side effects) in Redux.
- With Redux Toolkit, use `createAsyncThunk` to generate thunks that handle pending/fulfilled/rejected states automatically.
- Thunks are dispatched like actions and can update state via extra reducers.

## RTK Query
- RTK Query is a data fetching and caching tool built into Redux Toolkit.
- It generates endpoints, hooks, and manages caching, invalidation, and background refetching.
- Reduces the need for manual thunks/selectors for server data.

## Example

```js
// Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => { state.push(action.payload); }
  }
});

// Thunk
export const fetchTodos = createAsyncThunk('todos/fetch', async () => {
  const res = await fetch('/api/todos');
  return res.json();
});

// RTK Query
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query({ query: () => 'todos' })
  })
});
```

### Summary
- Redux Toolkit simplifies Redux development with slices, thunks, and RTK Query.
- Slices reduce boilerplate by combining reducers and actions.
- Thunks handle async logic and side effects in a structured way.
- RTK Query provides powerful data fetching and caching capabilities, reducing the need for manual thunks
- Use Redux Toolkit to write cleaner, more efficient Redux code with less boilerplate and better patterns for async logic and data fetching.
- RTK Query is especially useful for managing server state, providing built-in caching and invalidation
- Thunks are still useful for complex async logic that doesn't fit the RTK Query model, but RTK Query can handle most common data fetching scenarios with less code.
- Overall, Redux Toolkit's features help improve developer experience and maintainability in Redux applications.