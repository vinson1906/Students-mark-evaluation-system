import React from 'react'
import ProjectAndArchivements from './project'

function ProjectTeamPerfomence({ perfomenceData }: any) {
    return (
        <div className='w-full flex '>
            <ProjectAndArchivements perfomenceData={perfomenceData} />
        </div>
    )
}

export default ProjectTeamPerfomence
