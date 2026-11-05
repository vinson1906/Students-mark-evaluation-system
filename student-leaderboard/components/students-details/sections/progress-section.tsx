import React from 'react'
import ProgressPieChart from './progress-bar'

import Readerbar from './readerbar'





function ProgressBarSection({marks}:any) {

    const data = [
        {
            subject: "Practical Execution",
            A: marks?.practical_exqution,
            fullMark: 20
        },
        {
            subject: "HTML Skills",
            A: marks?.used_html,
            fullMark: 10
        },
        {
            subject: "CSS Skills",
            A: marks?.css_responsiveness,
            fullMark: 10
        },
        {
            subject: "JavaScript Skills",
            A: marks?.js_logic,
            fullMark: 20
        },
        {
            subject: "Viva",
            A: marks.viva,
            fullMark: 20
        },
        {
            subject: "Documentation",
            A: marks?.documendation,
            fullMark: 20
        }
    ]

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
