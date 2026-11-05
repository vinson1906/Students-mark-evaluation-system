import StudentDetails from '@/components/students-details'
import React, { Suspense } from 'react'
import { cookies } from 'next/headers'
import { BASE_URL } from '@/constant/constant'






async function StudentDetailsContent({ params }: any) {
    try {
        // Access route params inside Suspense
        const { id } = await params;

        // Read the browser's login cookies on the server
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const response = await fetch(
            `${BASE_URL}/marks/student/${id}`,
            {
                method: "GET",
                headers: {
                    Cookie: cookieHeader,
                },
                cache: "no-store",
            }
        );

        if (response.status === 401) {
            return (
                <div className="p-6 text-red-500">
                    Authentication required. Please log in again.
                </div>
            );
        }

        if (!response.ok) {
            console.error(
                "Student API error:",
                response.status,
                await response.text()
            );

            return (
                <div className="p-6 text-red-500">
                    Failed to load student details.
                </div>
            );
        }

        const result = await response.json();
        const studentData = result.data ?? result;

        console.log(studentData);


        return <StudentDetails studentData={studentData} />;
    }
    catch (err) {
        console.error("Error loading student details:", err);

        return (
            <div className="p-6 text-red-500">
                Something went wrong while loading student details.
            </div>
        );
    }
}





export default function StudentDetailsPage({
    params,
}:any) {
    return (
        <Suspense
            fallback={
                <div className="p-6 text-gray-500">
                    Loading student details...
                </div>
            }
        >
            <StudentDetailsContent params={params} />
        </Suspense>
    );
}
