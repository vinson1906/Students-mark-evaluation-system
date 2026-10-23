import "./App.css";

import DashboardLayout from "./components/layout/layout";
import { LoginPage } from "./pages/auth/login/login";
import { DepartmentPage } from "./pages/department/department-page";
import { LabPage } from "./pages/lab/labPage";
import { MarksPage } from "./pages/marks/marks-page";
import OverviewPage from "./pages/overview/overview";
import { SectionPage } from "./pages/section/section-page";
import { FacultyPage } from "./pages/staff/staff-page";
import { StudentPage } from "./pages/student/student-page";
import { TeamPage } from "./pages/teams/team-page";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./producted-route";

function App() {
  const pages = [
    { id: "overview", element: <OverviewPage /> },
    { id: "department", element: <DepartmentPage /> },
    { id: "section", element: <SectionPage /> },
    { id: "student", element: <StudentPage /> },
    { id: "marks", element: <MarksPage /> },
    { id: "team", element: <TeamPage /> },
    { id: "staff", element: <FacultyPage /> },
    { id: "labs", element: <LabPage /> },
  ];

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout pages={pages} />} />
        </Route>

      </Routes>



    </>
  );
}

export default App;