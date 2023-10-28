import {Server, Member, Profile, BannedUser} from "@prisma/client"
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
    bannedUsers: (BannedUser & { profile: Profile })[];
}