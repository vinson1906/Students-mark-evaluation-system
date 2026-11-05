import React from 'react'
import ProjectAndArchivements from './project'
import TeamPerfomence from './team_perfomence'

function ProjectTeamPerfomence({ perfomenceData }: any) {
    return (
        <div className='w-full flex gap-20 '>
            <ProjectAndArchivements perfomenceData={perfomenceData} />
            <TeamPerfomence perfomenceData={perfomenceData} />
        </div>
    )
}

export default ProjectTeamPerfomence
