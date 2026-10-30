import StudentDetails from '@/components/students-details'
import React from 'react'

function StudentDetailsPage() {




    const data = {
        "student_name": "ROSHINI J",
        "reg_no": "732226AI094",
        "department_code": "",
        "section": "B",
        "year": "1",
        "semester": "2",
        "rank": "1",
        "total_avg": "99.00",
        "grade": "A",
        "marks": {
            "practical_exqution": "10",
            "used_html": "10",
            "js_logic": "20",
            "css_responsiveness": "20",
            "viva": "19",
            "documendation": "20"
        },
        "project": {
            "project_name": "IPL Stats Website",
            "github": "https://github.com/vinson1906",
            "project_status": "PENDING"
        },
        "team_perfomence": {
            "team_id": "6ae3186db2d3477fd875d093",
            "team_avg": "93.50",
            "team_name": "CSK",
            "team_code": "T07",
            "team_members": [
                {
                    "student_id": "6ae07cf27e19a4c2e5583ab6",
                    "reg_no": "732226AI094",
                    "student_name": "ROSHINI J",
                    "rank": "1",
                    "total_avg": "99.00"
                },
                {
                    "student_id": "6ae07cf27e19a4c2e5583ab7",
                    "reg_no": "732226AI095",
                    "student_name": "SAMIDURAI T",
                    "rank": "3",
                    "total_avg": "88.00"
                }
            ]
        }
    }

    return (
        <div>
            <StudentDetails studentData={data} />


        </div>
    )
}

export default StudentDetailsPage
