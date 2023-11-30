import {Server as NetServer, Socket} from "net";
import {NextApiResponse} from "next";
import {Server as SocketIOServer} from "socket.io"

import {Server, Member, Profile, BannedUser} from "@prisma/client"
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
    bannedUsers: (BannedUser & { profile: Profile })[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};