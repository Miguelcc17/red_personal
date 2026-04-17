## 2024-05-24 - Frontend Re-render Complexity
**Learning:** Found an application-specific architectural bottleneck in the frontend: inside render loops, `Array.find()` was called iteratively on large arrays (e.g., getting a person by ID while looping over relationships). This caused O(N * M) time complexity and severe performance degradation when the network scaled.
**Action:** Always pre-compute a hash map using `useMemo` for O(1) lookups before rendering large collections that depend on relational data.
