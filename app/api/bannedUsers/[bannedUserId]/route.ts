import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function DELETE(
    req: Request,
    {params} : {params: {bannedUserId: string}}
) {
    try {
        
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        
        const serverId = searchParams.get("serverId");


        
        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId) {
            return new NextResponse("Server ID not found", {status: 400});
        }

        if(!params.bannedUserId) {
            return new NextResponse("Banned User ID not found", {status: 400});
        }

        const bannedUser = await db.bannedUser.findUnique({
            where: {
              id: params.bannedUserId,
            },
          });
      
        if (!bannedUser) {
            return new NextResponse("Banned User Not Found", { status: 404 });
        }

        
        const server = await db.server.update({
            where: {
                id: serverId,
                ownerId: profile.id,
            },
            data: {
                bannedUsers: {
                    deleteMany: {
                        id: params.bannedUserId,
                    }
                },
            },
            include: {
                bannedUsers : {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
        
        return NextResponse.json(server);
            
    } catch (error){
        console.log("[BANNEDUSER_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function POST(
    req: Request,
    {params} : {params: {bannedUserId: string}}
) {
    try {
        
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        
        const serverId = searchParams.get("serverId");

        
        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId) {
            return new NextResponse("Server ID not found", {status: 400});
        }

        if(!params.bannedUserId) {
            return new NextResponse("Member ID not found", {status: 400});
        }

        const member = await db.member.findUnique({
            where: {
              id: params.bannedUserId,
            },
          });
      
        if (!member) {
            return new NextResponse("Member Not Found", { status: 404 });
        }

        if (member.role === "ADMIN"){
            return new NextResponse("Cannot ban server owner", {status: 400});
        }

        
        const server = await db.server.update({
            where: {
                id: serverId,
                ownerId: profile.id,
            },
            data: {
                bannedUsers: {
                    create: [{
                        profileId: member.profileId,
                    }]
                },
            },
            include: {
                bannedUsers : {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });
        
        return NextResponse.json(server);
            
    } catch (error){
        console.log("[BANNEDUSER_ID_POST]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}