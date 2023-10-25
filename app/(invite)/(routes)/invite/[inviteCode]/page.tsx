import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {db} from '@/lib/db';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if(!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }


    const server = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
        },
        include: {
            bannedUsers: true,
            members: true,
        }
    })

    if (!server) {
        //TODO: Add 404 page
        return redirect("/");
    }

    const isBanned = server?.bannedUsers.some(
        (bannedUser => bannedUser.profileId === profile.id)
    )

    if (isBanned) {
        //TODO: Add ban page
        return redirect("/");
    }

    const isMember = server?.members.some(
        (member) => member.profileId === profile.id
    )

    if (isMember) {
        return redirect(`/servers/${server.id}`);
    }

    const updatedServer = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [{
                    profileId: profile.id,
                }]
            }
        }
    })

    if (updatedServer){
        return redirect(`/servers/${updatedServer.id}`);
    }

    return (
        null
    );
}

export default InviteCodePage;