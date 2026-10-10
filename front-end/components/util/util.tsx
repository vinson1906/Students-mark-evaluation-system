export const departments = [
  { id: '68f000000000000000000001', name: 'Computer Science and Engineering', code: 'CSE' },
  { id: '68f000000000000000000002', name: 'Information Technology', code: 'IT' },
  { id: '68f000000000000000000003', name: 'Electronics and Communication Engineering', code: 'ECE' },
]

export const labs = [
  { id: '68f000000000000000000051', name: 'WEBX', dept: 'CSE', year: '2026-2027', max: 60, faculty: 'Priya' },
  { id: '68f000000000000000000052', name: 'Web Development Lab', dept: 'IT', year: '2026-2027', max: 60, faculty: 'Arun' },
  { id: '68f000000000000000000053', name: 'Programming Fundamentals Lab', dept: 'ECE', year: '2026-2027', max: 60, faculty: 'Divya' },
]

export const faculty = [
  { id: '68f000000000000000000011', name: 'Priya', dept: 'CSE', lab: 'WEBX' },
  { id: '68f000000000000000000012', name: 'Arun', dept: 'IT', lab: 'Web Development Lab' },
  { id: '68f000000000000000000013', name: 'Divya', dept: 'ECE', lab: 'Programming Fundamentals Lab' },
]

export const sections = [
  { id: '68f000000000000000000021', name: 'CSE-A', dept: 'CSE', year: 2, semester: 3 },
  { id: '68f000000000000000000022', name: 'IT-A', dept: 'IT', year: 2, semester: 3 },
  { id: '68f000000000000000000023', name: 'ECE-A', dept: 'ECE', year: 2, semester: 3 },
]

export const students = [
  ['Vignesh','261CS001','CSE','CSE-A','Code Warriors'], ['Hari','261CS002','CSE','CSE-A','Code Warriors'], ['Sanjay','261CS003','CSE','CSE-A','Code Warriors'],
  ['Karthik','261IT001','IT','IT-A','Tech Titans'], ['Naveen','261IT002','IT','IT-A','Tech Titans'], ['Praveen','261IT003','IT','IT-A','Tech Titans'],
  ['Deepak','261EC001','ECE','ECE-A','Innovators'], ['Suresh','261EC002','ECE','ECE-A','Innovators'], ['Ajay','261EC003','ECE','ECE-A','Innovators'],
].map(([name, reg, dept, section, team], index) => ({ id: `68f00000000000000000003${index + 1}`, name, reg, dept, section, team }))

export const teams = [
  { id: '68f000000000000000000041', name: 'Code Warriors', section: 'CSE-A', members: 'Vignesh, Hari, Sanjay', project: 'Student Management System', github: 'github.com/example/code-warriors', report: 'PENDING', status: 'PENDING' },
  { id: '68f000000000000000000042', name: 'Tech Titans', section: 'IT-A', members: 'Karthik, Naveen, Praveen', project: 'College Event Management System', github: 'github.com/example/tech-titans', report: 'NOT_SUBMITTED', status: 'PENDING' },
  { id: '68f000000000000000000043', name: 'Innovators', section: 'ECE-A', members: 'Deepak, Suresh, Ajay', project: 'Smart Attendance System', github: 'github.com/example/innovators', report: 'NOT_SUBMITTED', status: 'NOT_SUBMITTED' },
]

export const marks = [
  { id: '68f000000000000000000061', student: 'Vignesh', team: 'Code Warriors', lab: 'WEBX', evaluator: 'Priya', practical: 10, html: 9, js: 8, css: 8, viva: 8, docs: 7, total: 50, status: 'COMPLETED' },
  { id: '68f000000000000000000062', student: 'Hari', team: 'Code Warriors', lab: 'WEBX', evaluator: 'Priya', practical: 9, html: 8, js: 7, css: 7, viva: 7, docs: 7, total: 45, status: 'PENDING' },
  { id: '68f000000000000000000063', student: 'Karthik', team: 'Tech Titans', lab: 'Web Development Lab', evaluator: 'Arun', practical: 10, html: 9, js: 9, css: 9, viva: 8, docs: 7, total: 52, status: 'COMPLETED' },
  { id: '68f000000000000000000064', student: 'Deepak', team: 'Innovators', lab: 'Programming Fundamentals Lab', evaluator: 'Divya', practical: 8, html: 7, js: 6, css: 6, viva: 6, docs: 6, total: 39, status: 'NOT_COMPLETED' },
]

export const navItems = ['Overview', 'Departments', 'Labs', 'Faculty', 'Sections', 'Students', 'Teams & Projects', 'Marks & Evaluations'] as const

export type PageName = typeof navItems[number]
export type DataKey = 'departments' | 'labs' | 'faculty' | 'sections' | 'students' | 'teams' | 'marks'
export type DataState = Record<DataKey, any[]>

export const cloneData = (): DataState => ({
  departments: [...departments],
  labs: [...labs],
  faculty: [...faculty],
  sections: [...sections],
  students: [...students],
  teams: [...teams],
  marks: [...marks],
})

export const pageToKey: Partial<Record<PageName, DataKey>> = {
  'Departments': 'departments',
  'Labs': 'labs',
  'Faculty': 'faculty',
  'Sections': 'sections',
  'Students': 'students',
  'Teams & Projects': 'teams',
  'Marks & Evaluations': 'marks',
}

export const dataTitles: Record<DataKey, string> = {
  departments: 'Departments',
  labs: 'Labs',
  faculty: 'Faculty',
  sections: 'Sections',
  students: 'Students',
  teams: 'Teams & Projects',
  marks: 'Marks & Evaluations',
}

export const statusLabel = (status: string) => status.replaceAll('_', ' ')
export const statusTone = (status: string) => status === 'COMPLETED' ? 'green' : status === 'PENDING' ? 'amber' : 'slate'

export const criteria = [
  ['practical', 'Practical execution'],
  ['html', 'HTML usage'],
  ['js', 'JavaScript logic'],
  ['css', 'CSS responsiveness'],
  ['viva', 'Viva'],
  ['docs', 'Documentation'],
] as const

export const totalMarks = (mark: any) => criteria.reduce((sum, [key]) => sum + Number(mark[key] || 0), 0)
export const percentage = (total: number) => Math.round((total / 60) * 100)
export const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
export const makeId = () => `local-${Date.now()}`

export const activity = [
  { title: 'Vignesh was evaluated', detail: 'WEBX · Code Warriors', time: '12 min ago', tone: 'blue' },
  { title: 'New project submitted', detail: 'Student Management System', time: '1 hr ago', tone: 'green' },
  { title: 'Faculty assignment updated', detail: 'Arun · Web Development Lab', time: '3 hrs ago', tone: 'violet' },
]

export const chartData = [42, 48, 44, 56, 51, 60, 54, 58, 52, 61, 57, 64]
export const quickActions = [
  { title: 'Add student', desc: 'Create a new student record', target: 'Students' as PageName },
  { title: 'Record evaluation', desc: 'Enter marks for a student', target: 'Marks & Evaluations' as PageName },
  { title: 'Create team', desc: 'Set up a project team', target: 'Teams & Projects' as PageName },
]

export const tableColumns: Record<DataKey, string[]> = {
  departments: ['Department', 'Code', 'Students', 'Faculty', 'Labs'],
  labs: ['Lab name', 'Department', 'Academic year', 'Max marks', 'Faculty'],
  faculty: ['Name', 'Department', 'Assigned lab'],
  sections: ['Section', 'Department', 'Year', 'Semester', 'Students'],
  students: ['Student', 'Register number', 'Department', 'Section', 'Team'],
  teams: ['Team', 'Section', 'Members', 'Project', 'Report', 'Project status'],
  marks: ['Student', 'Team', 'Lab', 'Evaluator', 'Score', 'Percentage', 'Status'],
}

export const badgeClass = (tone: string) =>
  ({
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
  } as Record<string, string>)[tone] || 'bg-slate-100 text-slate-600'

export const normalizeSearch = (value: string) => value.trim().toLowerCase()

export const pageDescription = (page: PageName) =>
  ({
    'Overview': 'A clear view of your lab evaluation activity.',
    'Departments': 'Organize academic departments and ownership.',
    'Labs': 'Manage lab courses, marks, and assignments.',
    'Faculty': 'Keep faculty assignments up to date.',
    'Sections': 'Manage batches, years, and semesters.',
    'Students': 'Search and manage student records.',
    'Teams & Projects': 'Track team projects and submissions.',
    'Marks & Evaluations': 'Review practical scores and evaluation progress.',
  } as Record<PageName, string>)[page]

export const deptColor = (dept: string) => (dept === 'CSE' ? 'blue' : dept === 'IT' ? 'violet' : 'orange')

export const iconTone = (tone: string) =>
  ({
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-emerald-50 text-emerald-600',
  } as Record<string, string>)[tone] || 'bg-slate-100 text-slate-500'

export const fieldsByKey: Record<DataKey, string[]> = {
  departments: ['name', 'code'],
  labs: ['name', 'dept', 'year', 'max', 'faculty'],
  faculty: ['name', 'dept', 'lab'],
  sections: ['name', 'dept', 'year', 'semester'],
  students: ['name', 'reg', 'dept', 'section', 'team'],
  teams: ['name', 'section', 'members', 'project', 'github', 'report', 'status'],
  marks: ['student', 'team', 'lab', 'evaluator', 'practical', 'html', 'js', 'css', 'viva', 'docs'],
}

export const labelFor = (key: string) =>
  ({
    reg: 'Register number',
    dept: 'Department',
    max: 'Maximum marks',
    year: 'Academic year',
    semester: 'Semester',
    lab: 'Assigned lab',
    project: 'Project title',
    github: 'GitHub URL',
    members: 'Members',
    report: 'Report status',
    status: 'Project status',
    student: 'Student',
    team: 'Team',
    evaluator: 'Evaluator',
    practical: 'Practical execution',
    html: 'HTML usage',
    js: 'JavaScript logic',
    css: 'CSS responsiveness',
    viva: 'Viva',
    docs: 'Documentation',
  } as Record<string, string>)[key] || key.charAt(0).toUpperCase() + key.slice(1)

export default {
  departments,
  labs,
  faculty,
  sections,
  students,
  teams,
  marks,
}

// Mock repository: replace these local methods with Express/MongoDB service calls later.
export const repository = {
  create: (items: any[], item: any) => [...items, item],
  update: (items: any[], item: any) => items.map((row) => (row.id === item.id ? item : row)),
  remove: (items: any[], id: string) => items.filter((row) => row.id !== id),
}

export const allData = { departments, labs, faculty, sections, students, teams, marks }
export const mockOnly = true
export const backend = 'Express/MongoDB later'
export const appName = 'Labwise'
export const userName = 'Ananya Rao'
export const today = 'Monday, October 10, 2026'
export const navIconNames = ['LayoutDashboard', 'Building2', 'FlaskConical', 'GraduationCap', 'Layers3', 'Users', 'FolderKanban', 'ClipboardCheck']
export const maxMarks = 60
export const allDepartments = departments.map((department) => department.code)
export const allSections = sections.map((section) => section.name)
export const allTeams = teams.map((team) => team.name)
export const allLabs = labs.map((lab) => lab.name)
export const allFaculty = faculty.map((member) => member.name)
export const allStudents = students.map((student) => student.name)
export const statusOptions = ['COMPLETED', 'PENDING', 'NOT_COMPLETED']
export const sampleForm = {
  name: '',
  code: '',
  dept: 'CSE',
  year: '2026-2027',
  semester: 3,
  max: 60,
  faculty: 'Priya',
  reg: '',
  section: 'CSE-A',
  team: 'Code Warriors',
  lab: 'WEBX',
  members: '',
  project: '',
  github: '',
  report: 'PENDING',
  status: 'PENDING',
  student: '',
  evaluator: 'Priya',
  practical: 0,
  html: 0,
  js: 0,
  css: 0,
  viva: 0,
  docs: 0,
}

export const sortByName = (a: any, b: any) => String(a.name || a.student).localeCompare(String(b.name || b.student))
export const matches = (row: any, query: string) => !query || Object.values(row).some((value) => normalizeSearch(String(value)).includes(normalizeSearch(query)))
export const countBy = (items: any[], key: string) => items.reduce((result, item) => ({ ...result, [item[key]]: (result[item[key]] || 0) + 1 }), {} as Record<string, number>)
export const deptCount = (data: DataState, dept: string, type: DataKey) => data[type].filter((item: any) => item.dept === dept).length
export const sectionCount = (data: DataState, section: string) => data.students.filter((student) => student.section === section).length
export const completedEvaluations = (data: DataState) => data.marks.filter((mark) => mark.status === 'COMPLETED').length
export const averageScore = (data: DataState) => Math.round(data.marks.reduce((sum, mark) => sum + mark.total, 0) / data.marks.length)
export const getKey = (page: PageName) => pageToKey[page]
export const defaultForm = (key: DataKey) => ({ ...sampleForm, id: makeId(), ...(key === 'marks' ? { student: students[0].name, team: teams[0].name, lab: labs[0].name } : {}) })
export const detailColumns = tableColumns
export const version = '1.0'
export const ready = true
export const sourceNote = 'Local mock data only'
export const appDescription = 'College lab evaluation operations dashboard'
export const footer = 'Labwise Academic Systems © 2026'
export const theme = 'light'
export const brandInitials = 'LW'
export const role = 'Administrator'
export const systemStatus = 'All systems operational'
export const linePoints = chartData.map((value, index) => `${index * 28},${120 - value * 1.45}`).join(' ')
export const lineMax = 70
export const chartTicks = ['Nov', 'Jan', 'Mar', 'May', 'Jul', 'Sep']
export const noBackend = true
export const futureIntegration = 'Node.js + Express + MongoDB'
export const lastUpdated = 'Updated just now'
export const emptyState = 'No records match your search.'
export const actionLabels = ['View', 'Edit', 'Delete']
export const initialsFor = initials
