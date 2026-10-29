

interface Section {
    department_name: String;
    section_name: String
}

interface Project {
    title: string;
    project_status: string;
    project_link: string;
    github_link: string
}

interface TeamPerfomence {
    internal: string;
    lab_record: string;
    viva: string
    project: string
}

interface Mark {
    internal: string;
    lab_record: string;
    viva: string
    project: string
    total: string
}

interface Student {
    reg_no: string
    marks: Mark
}

interface TeamMembers {
    [key: string]: Student
}

interface TopScorer {
    name: string;
    score: string
}


export interface Team {
    team_name: string;
    team_avg: string;
    team_no: string;
    team_rank: string;
    members_evaluvated: string;
    top_scorer: TopScorer;
    section: Section;
    project: Project;
    team_perfomence: TeamPerfomence;
    team_members: TeamMembers
}


export const TeamMockData: Team = {
    team_name: "Team 07",
    team_avg: "83",
    team_rank: "3",
    members_evaluvated: "3",
    team_no: "7",
    top_scorer: {
        name: "MS.Dhoni",
        score: "98"
    },
    section: {
        department_name: "Computer Science Engineering",
        section_name: "B"
    },
    project: {
        title: "Bus Ticket Booking Website",
        project_status: "In Progress",
        project_link: "https://vinson-portfolio-plum.vercel.app",
        github_link: "https://github.com/vinson1906"
    },
    team_perfomence: {
        internal: "72",
        lab_record: "75",
        viva: "94",
        project: "89"
    },
    team_members: {
        "divya-m": {
            reg_no: "CSE101",
            marks: {
                internal: "72",
                lab_record: "75",
                viva: "94",
                project: "89",
                total: "83"
            }
        },
        "karthik-k": {
            reg_no: "CSE102",
            marks: {
                internal: "72",
                lab_record: "75",
                viva: "94",
                project: "89",
                total: "83"
            }
        },
        "jason-t": {
            reg_no: "CSE103",
            marks: {
                internal: "74",
                lab_record: "76",
                viva: "80",
                project: "86",
                total: "82"
            }
        }
    }
}