## 2024-05-18 - [O(n²) Array.find() in Render Loops]
**Learning:** The frontend uses `Array.find()` inside render loops for relational data lookups (like resolving person names from IDs in a list of relationships). This causes O(n^2) performance bottlenecks as both relationships and persons grow.
**Action:** Always pre-compute O(1) Map objects using `useMemo` (e.g., `personsMap`) for fast lookups when resolving entities in lists.
