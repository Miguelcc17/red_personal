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

## 2024-05-30 - Hook Ordering and Early Returns
**Learning:** Adding a `useMemo` hook (or any hook) after an early return block (like `if (loading) return <Loader />;`) violates the Rules of Hooks, resulting in a fatal `Minified React error #310` (Rendered more hooks than during the previous render) on subsequent renders.
**Action:** Never place React hooks inside conditional render blocks, inline JSX expressions, or after early returns. Always declare all hooks at the top level of the component before any early return statements.
## 2024-06-03 - Filtering Optimization in Search Inputs
**Learning:** Found an application-specific bottleneck where search inputs updating state on every keystroke (`onChange`) trigger full re-renders and costly `O(N)` filtering loops in `PersonsPage.jsx`. Because the filtering operations depend on `searchTerm`, the `useMemo` caching fails on every keystroke.
**Action:** Extract a custom `useDebounce` hook to delay state changes passed to the filtering `useMemo` block. This reduces `O(N)` array operations during rapid typing without sacrificing perceived responsiveness.
## 2024-06-03 - [React.memo on Static Sibling Layout Components]
**Learning:** Found an application-specific architectural bottleneck in the frontend: `Navbar` is a static sibling component rendered alongside heavy page components like `Network2DPage` and `Network3DPage`. When users interact with the graph (e.g. clicking a node, updating parent component's local state `selectedNode`), it triggers a re-render of the entire page, including the `Navbar` component unnecessarily.
**Action:** Always apply `React.memo` to static or sibling layout components that do not accept `children` props (e.g., `Navbar`) to prevent them from re-rendering when parent container states update.

## 2024-06-05 - Optimize inline array maps with useMemo in heavy forms
**Learning:** In components handling local form state with frequent updates (like `searchTerm` updating on keystrokes in `PersonsPage.jsx` or `logInput` updating in `RelationshipsPage.jsx`), leaving `.map()` rendering operations inline forces React to re-evaluate and re-create `O(N)` elements on every state change, causing severe input lag.
**Action:** When rendering arrays of React elements using `.map()` inside components that handle frequent local state updates, always wrap the entire mapping operation in a `useMemo` hook (e.g., `const renderedList = useMemo(() => data.map(...), [data])`) to prevent O(N) element recreation on unrelated state changes.
## 2024-06-08 - UseMemo for mapping inline lists during form inputs
**Learning:** Found an application-specific bottleneck where the `EditRelationshipModal.jsx` and `RelationshipsPage.jsx` had a form state (`logInput`) driving updates on every keystroke. The modal rendered a history log using `formData.bitacora.map` without memoization, meaning every single keystroke in the input fields forced React to recreate and evaluate an O(N) array of `LogItem` React Elements.
**Action:** Always extract dynamically rendered list items (like the `bitacora` entries) into `<React.memo()>` components and wrap the outer array mapping (`data.map`) in a `useMemo` block. Ensure any event handlers (like `onDelete`) passed to these items are stabilized via `useCallback` to preserve the memoization barrier.
## 2024-06-10 - Prevent inline form full re-renders on keystrokes
**Learning:** Found an application-specific bottleneck in the frontend: the `PersonForm` handles multiple input fields through a single `formData` state object. On every keystroke, `handleChange` triggered `setFormData`, which caused a full re-render of the entire `PersonForm` including all its heavy child elements (over 50 inputs/selects/buttons), leading to noticeable input lag. Because standard HTML `<input>` tags were used, React couldn't skip rendering them.
**Action:** When working with large forms that handle state locally, extract the standard input and select fields into `<React.memo()>` components (like `MemoInput` and `MemoSelect`) and wrap the generic `handleChange` in `useCallback()` utilizing functional state updates (e.g. `setFormData(prev => ...)`). This ensures the input fields only re-render when their specific `value` prop changes, massively improving keystroke responsiveness.
\n## 2026-05-10 - Prevent O(N) recreations of complex detail panels\n**Learning:** In components rendering highly complex data structures passed as props, such as `NodeDetailsPanel` and `LinkDetailsPanel`, leaving operations like `Object.entries(props).map()` or `JSON.parse(props.bitacora)` inline causes the entire panel to unnecessarily re-evaluate and recreate a large DOM tree whenever the parent component state changes (e.g. toggling a modal).\n**Action:** When a UI panel is tasked with rendering dynamic complex data arrays, always wrap the component in `React.memo` and ensure any inner map logic over object keys or array string parsing is wrapped in `useMemo`.
## 2024-11-20 - Unnecessary useMemo micro-optimization
**Learning:** Avoid wrapping simple array slicing (e.g., 'persons.slice(0, 3)') in 'useMemo' hooks for small arrays, as the hook's overhead is often greater than the slicing operation itself, resulting in a micro-optimization with no measurable impact.
**Action:** Do not use `useMemo` for simple operations like small array slicing unless there is a proven performance bottleneck. Focus on memoizing expensive operations or objects/functions that are passed as props to child components.

## 2026-05-13 - O(N) recreations of complex detail panels
**Learning:** In components rendering highly complex data structures passed as props, such as `NodeDetailsPanel` and `LinkDetailsPanel`, leaving operations like `Object.entries(props).map()` or `JSON.parse(props.bitacora)` inline causes the entire panel to unnecessarily re-evaluate and recreate a large DOM tree whenever the parent component state changes (e.g. toggling a modal).
**Action:** When a UI panel is tasked with rendering dynamic complex data arrays, always wrap the component in `React.memo` and ensure any inner map logic over object keys or array string parsing is wrapped in `useMemo`.
## 2026-05-18 - Cartesian product explosion in Cypher OPTIONAL MATCH queries
**Learning:** Found a major performance bottleneck where multiple sequential `OPTIONAL MATCH` clauses for 1-to-N relationships in Cypher queries created massive Cartesian products. E.g., querying 5 hobbies, 3 languages, and 4 jobs for one person forces Neo4j to evaluate 60 rows instead of 12. This leads to `O(N*M*P)` complexity that crashes under load.
**Action:** When querying 1-to-N relationships in Neo4j, replace chained `OPTIONAL MATCH` clauses with Cypher Pattern Comprehensions (e.g., `[(p)-[r]->(h) | properties(r)]`). This evaluates each list independently in `O(N+M+P)` linear time and safely returns empty lists without null checking list comprehensions in Python.
## 2026-05-18 - Cartesian product explosion in PersonRepository.get_all Cypher OPTIONAL MATCH queries
**Learning:** Found an application-specific bottleneck in the backend where `PersonRepository.get_all` uses multiple sequential `OPTIONAL MATCH` clauses for 1-to-N relationships (like `HAS_GENDER`, `WORKS_AS`, `LIVES_IN`). This creates a massive Cartesian product, significantly increasing the complexity to `O(N*M*P)`.
**Action:** Replace multiple `OPTIONAL MATCH` clauses with Cypher Pattern Comprehensions (e.g., `[(p)-[:HAS_GENDER]->(g:Gender) | g.nombre][0] as genero`) to ensure linear evaluation time `O(N+M+P)`.

## 2026-05-19 - Cartesian product explosion in Cypher full graph queries
**Learning:** Found an application-specific bottleneck in the backend where `GraphRepository.get_full_graph` used a single query with `OPTIONAL MATCH (n)-[r]->(m)` followed by `collect(distinct n)` and `collect(distinct {source...})`. This creates a Cartesian product of size O(N * E) and forces the Neo4j database to aggregate the entire graph into a single memory-heavy result row, leading to severe performance bottlenecks and OutOfMemory errors on large graphs.
**Action:** Always fetch nodes and links in separate, streamed queries (e.g., `MATCH (n) RETURN n` and `MATCH (n)-[r]->(m) RETURN ...`) when retrieving a full graph or large subgraphs. This allows Neo4j to stream the results directly in linear `O(N) + O(E)` time without the massive `collect(distinct)` aggregation overhead.

## 2024-06-25 - Cartesian product explosion in PersonRepository.get_by_id Cypher OPTIONAL MATCH queries
**Learning:** Found an application-specific bottleneck in the backend where `PersonRepository.get_by_id` used multiple sequential `OPTIONAL MATCH` clauses for 1-to-N relationships (like `HAS_GENDER`, `WORKS_AS`, `LIVES_IN`, `HAS_TATTOO`). This creates a massive Cartesian product, significantly increasing the complexity to `O(N*M*P)`.
**Action:** Replace multiple `OPTIONAL MATCH` clauses with Cypher Pattern Comprehensions (e.g., `[(p)-[:HAS_GENDER]->(g:Gender) | g.nombre][0] as genero`) to ensure linear evaluation time `O(N+M+P)`.
