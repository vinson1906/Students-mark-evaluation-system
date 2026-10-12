# College Lab Evaluation System (frontend)

React + Tailwind CSS admin dashboard. All data is mock data held in React state; there is no backend.

```bash
npm install
npm run dev      # development server
npm run build    # production build
```

## Structure

```
src/
  data/            mock*.js files (replace later)
  services/        dataService.js - the only place that loads data / creates ids
  context/         AppDataContext (state + CRUD), ToastContext, RouterContext (hash router)
  components/      Sidebar, Topbar, StatCard, DataTable, StatusBadge, SearchFilter,
                   FormModal, ConfirmDialog, EmptyState, ResourcePage, charts/...
  pages/           one file per sidebar item
```

## Connecting your Express/MongoDB backend later

1. `services/dataService.js`: replace `loadAll()` with fetch/axios calls and load the result in `AppDataProvider` (add a loading state).
2. `context/AppDataContext.jsx`: the `insert`, `patch` and `drop` helpers (and the custom student/team/marks actions) are the only places that change records. Swap them for POST/PUT/DELETE calls and update state from the response.
3. Remove `generateObjectId()`; MongoDB assigns `_id`.

Records keep your supplied IDs and use `_id`, `departmentId`, `sectionId`, `teamId`, `labId`, `evaluatedBy` (a faculty `_id`) and `maxMarks`. Evaluations also carry an `evaluatedOn` date, used only for the "recent evaluations" list.
