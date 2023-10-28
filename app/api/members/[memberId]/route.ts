import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function DELETE(
    req: Request,
    {params} : {params: {memberId: string}}
) {
    try {
        
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        
        const serverId = searchParams.get("serverId");
        const ban = searchParams.get("ban") === "true";

        console.log("BAN?", ban)

        
        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId) {
            return new NextResponse("Server ID not found", {status: 400});
        }

        if(!params.memberId) {
            return new NextResponse("Member ID not found", {status: 400});
        }

        const member = await db.member.findUnique({
            where: {
              id: params.memberId,
            },
          });
      
        if (!member) {
            return new NextResponse("Member not found", { status: 404 });
        }

        
        const server = await db.server.update({
            where: {
                id: serverId,
                ownerId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id,
                        }
                    }
                },
                ...(ban && member.profileId !== profile.id
                    ? {
                        bannedUsers: {
                            create: [{
                                profileId: member.profileId,
                            }]
                        },
                      }
                    : {}),
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                },
                bannedUsers : {
                    include: {
                        profile: true,
                    }
                }
            }
        });
        
        return NextResponse.json(server);
            
    } catch (error){
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}

export async function PATCH(
    req: Request,
    {params} : {params: {memberId: string}}
) {
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);
        const {role} = await req.json();

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!serverId) {
            return new NextResponse("Server ID not found", {status: 400});
        }

        if (!params.memberId){
            return new NextResponse("Member ID not found", {status: 400});
        }
        
        const server = await db.server.update({
            where: {
                id: serverId,
                ownerId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id,
                            }
                        },
                        data: {
                            role,
                        }
                    },
                    
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }    
        });

        return NextResponse.json(server);

    } catch (error){
        console.log("[MEMBERS_ID_PATCH]", error)
        return new NextResponse("Internal Server Error", {status: 500});
    }
}