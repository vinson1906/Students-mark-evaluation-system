import React from 'react'

function TeamMembers({ teamMembers }: any) {

    const members_name = Object.keys(teamMembers)

    const marks = members_name.map((ele, i) => {
        console.log(ele)
        console.log("students internals", teamMembers?.[`${ele}`]?.marks)
    })

    return (
        <div className=''>
            <h1 className='text-2xl font-bold text-white'>Team Members</h1>
            <div className="w-full overflow-x-auto rounded-lg border border-gray-700 my-4 ">
                <table className="w-full min-w-[1100px] border-collapse text-left ">
                    <thead className="border-b border-gray-700 bg-[#111827]">
                        <tr>
                            <th className="w-[60px] px-4 py-4 text-[#C5C8DE] font-medium">
                                S.No
                            </th>
                            <th className="w-[360px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Member
                            </th>
                            <th className="w-[150px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Internal/20
                            </th>
                            <th className="w-[150px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Lab/20
                            </th>
                            <th className="w-[150px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Viva/20
                            </th>
                            <th className="w-[150px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Project/40
                            </th>
                            <th className="w-[150px] px-4 py-4 text-[#C5C8DE] font-medium">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {members_name.map((ele, i) => {
                            const marks = teamMembers[ele]?.marks;

                            return (
                                <tr
                                    key={i}
                                    className="border-b border-gray-700 transition-colors hover:bg-[#1F2937]"
                                >
                                    <td className="px-4 py-4 text-[#C5C8DE]">
                                        {i + 1}
                                    </td>

                                    <td className="px-4 py-4 text-[#C5C8DE] font-medium">
                                        {ele}
                                    </td>

                                    <td className="px-4 py-4 text-[#C5C8DE]">
                                        {marks?.internal ?? "-"}
                                    </td>

                                    <td className="px-4 py-4 text-[#C5C8DE]">
                                        {marks?.lab_record ?? "-"}
                                    </td>

                                    <td className="px-4 py-4 text-[#C5C8DE]">
                                        {marks?.viva ?? "-"}
                                    </td>

                                    <td className="px-4 py-4 text-[#C5C8DE]">
                                        {marks?.project ?? "-"}
                                    </td>

                                    <td className="px-4 py-4 text-white font-semibold">
                                        {marks?.total ?? "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeamMembers
