import React from 'react'
import StudentTopBar from './sections/student-top-bar'
import KpiCards from './sections/kpi-cards'

export default function StudentDetails({ studentData }: any



    
) {
    return (
        <div className='w-full flex justify-center bg-[#F5F3FF]'>
            <div className='max-w-[80%] w-full '>
                <StudentTopBar student={studentData} />
                <KpiCards cardsData={studentData} />
            </div>
        </div>
    )
}
 