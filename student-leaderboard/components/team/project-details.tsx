import { Share } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

function ProjectScetion({ projectData }: any) {
    return (
        <div className='mt-10 border-b border-b-gray-600 pb-6'>
            <h1 className='text-2xl font-bold text-white'>Project</h1>
            <div>
                <div className='flex gap-20 py-4 border-b-[1px] border-b-gray-600 '>
                    <p className='text-gray-400 w-[250px]'>Title</p>
                    <p className='text-white font-bold'>{projectData.title}</p>
                </div>
                <div className='flex gap-20 py-4 border-b-[1px] border-b-gray-600 '>
                    <p className='text-gray-400 w-[250px]'>Status</p>
                    <p className='text-white font-bold'>{projectData.project_status}</p>
                </div>
                <div className='flex gap-20 py-4 border-b-[1px] border-b-gray-600 '>
                    <p className='text-gray-400 w-[250px]'>Project Link</p>
                    <p className='text-white font-bold'><Link href={`${projectData.project_link}`} className='flex gap-2 items-center text-violet-400'>Open Link  <Share size={20} className='rotate-90' /></Link></p>
                </div>
                <div className='flex gap-20 py-4 border-b-[1px] border-b-gray-600 '>
                    <p className='text-gray-400 w-[250px]'>GitHub</p>
                    <p className='text-white font-bold'><Link href={`${projectData.github_link}`} className='flex gap-2 items-center text-violet-400'>{projectData.github_link} <Share size={20} className='rotate-90' /></Link></p>
                </div>
            </div>

        </div >
    )
}

export default ProjectScetion
