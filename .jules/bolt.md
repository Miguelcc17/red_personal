## 2024-05-24 - Frontend Re-render Complexity
**Learning:** Found an application-specific architectural bottleneck in the frontend: inside render loops, `Array.find()` was called iteratively on large arrays (e.g., getting a person by ID while looping over relationships). This caused O(N * M) time complexity and severe performance degradation when the network scaled.
**Action:** Always pre-compute a hash map using `useMemo` for O(1) lookups before rendering large collections that depend on relational data.

## 2024-05-18 - Early return in useMemo for filtering collections
**Learning:** In React components that filter arrays based on a search term, missing an early return for an empty search term triggers unnecessary `O(N)` loop iterations and string operations (`.toLowerCase()`, string interpolations) on every render when the search is inactive or clears.
**Action:** Always include an early return (e.g., `if (!searchTerm) return data;`) at the beginning of filter functions or `useMemo` blocks to skip processing when filtering is not needed.

## 2024-05-25 - Prevent inline array recreation and slicing during render
**Learning:** Found components (e.g. `Dashboard.jsx`) defining static arrays and performing slicing (e.g., `persons.slice(0, 5)`) inline during render. This allocates new arrays on every render cycle, which can cause unnecessary re-renders of child components even if data hasn't changed.
**Action:** Wrap inline array generation and slice operations in `useMemo` with appropriate dependency arrays to preserve reference equality across renders.
## 2024-04-25 - [React.memo and useCallback optimization]
**Learning:** Adding React.memo() to a list component is ineffective if the parent passes down unstable function references (like a fetch data function generated inside a custom hook).
**Action:** Always verify that functional props passed to memoized components are wrapped in useCallback() all the way up the chain, including internal hook methods like `fetchPersons`.
## 2024-05-26 - [React Hook Function Memoization]
**Learning:** Found custom hooks (`useRelationships` and `useGraphData`) that exported fetch functions (`fetchRelationships`, `fetchGraph`) without wrapping them in `useCallback`. This is an anti-pattern as these functions are often passed as dependencies to `useEffect` or as props to child components, causing unnecessary re-renders or infinite loops when the hook's internal state updates.
**Action:** Always wrap functions exported from custom hooks in `useCallback` to guarantee a stable reference across renders, especially when those functions trigger state updates within the hook.

## 2024-05-27 - Inline array list rendering performance bottlenecks in React forms
**Learning:** Found a major performance bottleneck where the `RelationshipsPage.jsx` had a form state (`formData`, `logInput`) driving updates on every keystroke. Because the entire list of connections was mapped inline inside this parent component without memoization, every keystroke triggered a full O(N) re-render of the list. This included re-triggering map lookups (`getPersonName`) inside the list items.
**Action:** When a React page has large interactive lists alongside forms with frequently updating state (like keystrokes), always extract the list item into its own `<React.memo()>` component and wrap any handler functions (`onClick`, fetch callbacks, helper methods like `getPersonName`) passed to it in `useCallback()` to maintain referential equality and preserve the memoization barrier.
## 2024-05-18 - Extracted React.memo PersonSelectorCard
**Learning:** In list rendering where each child element interacts with the state via functions constructed per-render using inline callbacks `onClick={() => ... }`, the resulting React Tree forces a top-down re-render cycle on every update, yielding O(N * (Updates)) rendering overhead.
**Action:** Extract list items to smaller memoized components `React.memo` and provide handlers stabilized via `useCallback`, as done with `PersonSelectorCard` in `RelationshipsPage.jsx`.
