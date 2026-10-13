import {
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  ClipboardCheck,
  UsersRound,
  GraduationCap,
  FlaskConical,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "department", label: "Departments", icon: Building2 },
  { id: "section", label: "Sections", icon: Layers },
  { id: "student", label: "Students", icon: GraduationCap },
  { id: "marks", label: "Marks Evaluation", icon: ClipboardCheck },
  { id: "team", label: "Teams", icon: UsersRound },
  { id: "staff", label: "Faculty", icon: Users },
  { id: "labs", label: "Labs", icon: FlaskConical },
];