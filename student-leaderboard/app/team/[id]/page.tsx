import { Suspense } from "react";
import { cookies } from "next/headers";

import TeamDetails from "@/components/team/teamDetails";
import { BASE_URL } from "@/constant/constant";
import { log } from "console";

interface TeamDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function TeamDetailsContent({
    params,
}: TeamDetailsPageProps) {
    try {
        // Access route params inside Suspense
        const { id } = await params;

        // Read the browser's login cookies on the server
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const response = await fetch(
            `${BASE_URL}/teams/get/${id}`,
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
                "Team API error:",
                response.status,
                await response.text()
            );

            return (
                <div className="p-6 text-red-500">
                    Failed to load team details.
                </div>
            );
        }

        const result = await response.json();
        const teamData = result.data ?? result;

        console.log(teamData);


        return <TeamDetails data={teamData[0]} />;
    } catch (error) {
        console.error("Error loading team details:", error);

        return (
            <div className="p-6 text-red-500">
                Something went wrong while loading team details.
            </div>
        );
    }
}

export default function TeamDetailsPage({
    params,
}: TeamDetailsPageProps) {
    return (
        <Suspense
            fallback={
                <div className="p-6 text-gray-500">
                    Loading team details...
                </div>
            }
        >
            <TeamDetailsContent params={params} />
        </Suspense>
    );
}