import "./App.css";

import DashboardLayout from "./components/layout/layout";
import { DepartmentPage } from "./pages/department/department-page";
import DepartmentTable from "./pages/department/department-table";
import { LabPage } from "./pages/lab/labPage";
import { MarksPage } from "./pages/marks/marks-page";
import { SectionPage } from "./pages/section/section-page";
import { FacultyPage } from "./pages/staff/staff-page";
import { StudentPage } from "./pages/student/student-page";
import { TeamPage } from "./pages/teams/team-page";

const Pages = [
  {
    id: "department",
    element: <DepartmentPage />,
  },
  {
    id: "section",
    element: <SectionPage />,
  },
  {
    id: "student",
    element: <StudentPage />,
  },
  {
    id: "marks",
    element: <MarksPage />,
  },
  {
    id: "team",
    element: <TeamPage />,
  },
  {
    id: "staff",
    element: <FacultyPage />,
  },
  {
    id: "labs",
    element: <LabPage />,
  },
  {
    id: "overview",
    element: <h1 className="text-2xl font-bold">Overview</h1>,
  },
];

function App() {
  return (
    <>
      <DashboardLayout pages={Pages} />
      {/* <DepartmentPage /> */}
    </>

  );
}

export default App;