/**
 * Data access layer (mock repository).
 *
 * Everything that reads or creates records goes through this file, so the rest of the app never
 * imports mock data directly. To connect your Express/MongoDB backend later:
 *   1. Replace `loadAll()` with fetch/axios calls (one per collection, or a single endpoint) and
 *      load the result in AppDataProvider with useEffect + a loading state.
 *   2. Replace the insert/patch/drop helpers inside AppDataProvider (src/context/AppDataContext.jsx)
 *      with POST / PUT / DELETE calls, then update local state from the response.
 *   3. Remove `generateObjectId()` - MongoDB will assign `_id` itself.
 *
 * Field names (`_id`, `departmentId`, `sectionId`, `teamId`, `labId`, `evaluatedBy`, ...) mirror the
 * supplied models, and relationships are stored as `_id` strings (ObjectId-compatible).
 */
import {
  mockDepartments,
  mockLabs,
  mockFaculty,
  mockSections,
  mockStudents,
  mockTeams,
  mockMarks,
} from '../data';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const dataService = {
  loadAll() {
    return {
      departments: clone(mockDepartments),
      labs: clone(mockLabs),
      faculty: clone(mockFaculty),
      sections: clone(mockSections),
      students: clone(mockStudents),
      teams: clone(mockTeams),
      marks: clone(mockMarks),
    };
  },
};

/** 24-character hex string shaped like a MongoDB ObjectId (timestamp + random). */
export function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  let random = '';
  for (let i = 0; i < 16; i += 1) random += Math.floor(Math.random() * 16).toString(16);
  return timestamp + random;
}
