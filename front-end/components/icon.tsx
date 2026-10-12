export const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
    const paths: Record<string, string> = {
        LayoutDashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
        Building2: 'M4 21V5l8-2 8 2v16M8 9h1m6 0h1M8 13h1m6 0h1M8 17h1m6 0h1M10 21v-4h4v4',
        FlaskConical: 'M9 3v7l-5 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-8V3M8 3h8M7 15h10',
        GraduationCap: 'm3 10 9-5 9 5-9 5-9-5Zm4 3v4c3 2 7 2 10 0v-4M21 10v6',
        Layers3: 'm12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5',
        Users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
        FolderKanban: 'M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm4 5h10m-10 4h6',
        ClipboardCheck: 'M9 5h6m-8 0H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 14l2 2 4-4',
    }
    return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.LayoutDashboard} /></svg>
}