import {
  LayoutDashboard,
  Building2,
  FlaskConical,
  Presentation,
  Layers,
  GraduationCap,
  UsersRound,
  ClipboardCheck,
} from 'lucide-react';

export const NAV_ITEMS = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/departments', label: 'Departments', icon: Building2 },
  { path: '/labs', label: 'Labs', icon: FlaskConical },
  { path: '/faculty', label: 'Faculty', icon: Presentation },
  { path: '/sections', label: 'Sections', icon: Layers },
  { path: '/students', label: 'Students', icon: GraduationCap },
  { path: '/teams', label: 'Teams & Projects', icon: UsersRound },
  { path: '/marks', label: 'Marks & Evaluations', icon: ClipboardCheck },
];

export const DEFAULT_PATH = '/overview';
