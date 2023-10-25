import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import {v4 as uuidv4} from "uuid";

export async function PATCH (
    req: Request,
    {params}: { params: {serverId: string} }
) { 
    try {
        const profile = await currentProfile();

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!params.serverId) {
            return new NextResponse("Bad Request", {status: 400}); 
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                //This may need to change in the future so that non-owner administrators can also change the invite code
                ownerId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", {status: 500});
    }
}