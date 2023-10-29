import {currentUser, redirectToSignIn} from "@clerk/nextjs";

import {db} from "@/lib/db";

export const updateProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        }
    });

    const currentUserData = {
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
    };

    if (
        profile &&
        profile.name === currentUserData.name &&
        profile.imageUrl === currentUserData.imageUrl &&
        profile.email === currentUserData.email
    ) {
        return;
    }

    await db.profile.update({
        where: {
            userId: user.id,
        },
        data: currentUserData,
    });
}