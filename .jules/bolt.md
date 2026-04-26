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

## 2024-04-26 - Memoization of Graph Link Color Callbacks
**Learning:** In the `react-force-graph` ecosystem (`react-force-graph-2d` and `react-force-graph-3d`), passing an inline function or dynamically created callback to props like `linkColor` breaks the component's internal memoization. Since these are heavy WebGL/Canvas components, providing an unstable function reference triggers expensive child re-renders on every parent update, causing severe performance degradation during simple state changes.
**Action:** Always extract functional props intended for graph components into stable references using `useCallback` (or `useMemo` if returning an object/array) with an appropriate dependency array, typically `[]` for static evaluators.
