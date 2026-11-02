import React from 'react'
import ProgressPieChart from './progress-bar'

import Readerbar from './readerbar'

const data = [
    {
        subject: "Practical Execution",
        A: 17,
        fullMark: 20
    },
    {
        subject: "HTML Skills",
        A: 9,
        fullMark: 20
    },
    {
        subject: "CSS Skills",
        A: 8,
        fullMark: 10
    },
    {
        subject: "JavaScript Skills",
        A: 16,
        fullMark: 10
    },
    {
        subject: "Viva",
        A: 10,
        fullMark: 20
    },
    {
        subject: "Documentation",
        A: 17,
        fullMark: 20
    },
    {
        subject: "Record Mark",
        A: 15,
        fullMark: 20
    }
]

function ProgressBarSection() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Progress Overview</h1>
            <div className='w-full flex  items-center  z-10'>

                <Readerbar ReaderData={data} />

                <ProgressPieChart chartData={data} />

            </div>
        </div>

    )
}

export default ProgressBarSection
