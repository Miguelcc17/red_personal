## 2024-05-24 - Frontend Re-render Complexity
**Learning:** Found an application-specific architectural bottleneck in the frontend: inside render loops, `Array.find()` was called iteratively on large arrays (e.g., getting a person by ID while looping over relationships). This caused O(N * M) time complexity and severe performance degradation when the network scaled.
**Action:** Always pre-compute a hash map using `useMemo` for O(1) lookups before rendering large collections that depend on relational data.

## 2024-05-18 - Early return in useMemo for filtering collections
**Learning:** In React components that filter arrays based on a search term, missing an early return for an empty search term triggers unnecessary `O(N)` loop iterations and string operations (`.toLowerCase()`, string interpolations) on every render when the search is inactive or clears.
**Action:** Always include an early return (e.g., `if (!searchTerm) return data;`) at the beginning of filter functions or `useMemo` blocks to skip processing when filtering is not needed.
