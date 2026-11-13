import React from 'react'
import TopSection from './top-section'
import ProjectScetion from './project-details'
import TeamPerfomence from './team-perfomence'
import TeamMembers from './team-members'

function TeamDetails({ data }: any) {
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
