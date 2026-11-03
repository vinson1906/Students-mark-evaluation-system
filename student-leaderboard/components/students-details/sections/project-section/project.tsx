import { Share } from 'lucide-react'
import Link from 'next/link'
import { Link as Linking } from "lucide-react"
import React from 'react'

function ProjectAndArchivements({ perfomenceData }: any) {

    const logoLetters = (name: any) => {
        console.log(name, "name")
        const nameCaps = name?.split(" ")
        return nameCaps?.[0]?.[0] + nameCaps?.[1]?.[0];
    }

    const colors = ['#FFC141', '#3B3E6A', '#1FB5A3', '#21265F', '#393C8A']

    return (
        < div className='w-full flex flex-col gap-4 bg-white max-w-[60%] p-4 my-6 rounded-2xl' >
            <div className='w-full flex justify-between items-center'>
                <h1 className="text-xl font-bold text-gray-400">Current Project</h1>
                <p className="text-lg font-semibold text-white bg-amber-400 rounded-2xl px-4 py-2">
                    {perfomenceData?.project?.project_status?.toLowerCase() || "No description available."}
                </p>
            </div>
            <p className="text-2xl font-bold text-gray-800">
                {perfomenceData?.project?.project_name || "No current project assigned."}
            </p>
            <Link
                href={perfomenceData?.project?.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-violet-500 p-4 rounded-lg text-xl font-bold flex gap-2 items-center"
            >
                <Linking /> {perfomenceData?.project?.github || "No description available."}
            </Link>
            <div className='w-full flex gap-4 items-center'>
                <div className="flex items-center -space-x-2">
                    {perfomenceData?.team_perfomence?.team_members?.map(
                        (ele: any, i: number) => (
                            <div
                                key={i}
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white"
                                style={{
                                    backgroundColor: colors[i % colors.length],
                                    zIndex: 10 - i,
                                }}
                            >
                                <p className="text-xs font-bold text-white">
                                    {logoLetters(ele?.student_name)}
                                </p>
                            </div>
                        )
                    )}

                </div>
                <p className="text-lg font-semibold text-gray-800">
                    Team Code: {perfomenceData?.team_perfomence?.team_code}
                </p>
            </div>

        </div>

    )
}

export default ProjectAndArchivements
