import React from 'react'
import TopSection from './top-section'
import type { Team } from './teamMock'
import ProjectScetion from './project-details'
import TeamPerfomence from './team-perfomence'
import TeamMembers from './team-members'


const team_members = {
    "nandha_kishore_p_k": {
        "reg_no": "732226AI064",
        "marks": {
            "internal": "17",
            "lab_record": "15",
            "viva": "18",
            "project": "27",
            "total": "77"
        }
    },
    "naresh_s": {
        "reg_no": "732226AI065",
        "marks": {
            "internal": "20",
            "lab_record": "20",
            "viva": "17",
            "project": "29",
            "total": "86"
        }
    }
}

function TeamDetails({ data }: Team) {
    return (
        <>
            <div className='flex  flex-col items-center '>
                <div className='w-full  bg-[#0A0C24] flex justify-center'>

                    <TopSection teamData={data} />

                </div>
                <div className='w-full max-w-[60%] flex flex-col gap-10'>

                    <ProjectScetion projectData={data?.project} />
                    <TeamPerfomence teamPerfomenceData={data?.team_perfomence} />
                    <TeamMembers teamMembers={data?.team_members} />
                </div>
            </div>

        </>



    )
}

export default TeamDetails
