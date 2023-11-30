"use client";

import qs from "query-string";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldMinus, Loader2} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { on } from "events";






export const BannedUsersModal = () => {
    const router = useRouter();
    const {onOpen, isOpen, onClose, type, data} = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "bannedUsers";
    const {server} = data as {server: ServerWithMembersWithProfiles};

   
    
    const onUnban = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/bannedUsers/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });

        const response = await axios.delete(url);

        router.refresh();
        onOpen("bannedUsers", {server: response.data});
    } catch (error){
        console.log(error);
    } finally {
        setLoadingId("");
    }
}




    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Banned Users
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.bannedUsers?.length} Banned Users
                    </DialogDescription>
                </DialogHeader>
                

                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.bannedUsers?.map((bannedUser) => (
                        <div key={bannedUser.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={bannedUser.profile.imageUrl} />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {bannedUser.profile.name}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {bannedUser.profile.username}
                                </p>
                            </div>
                            {server.ownerId !== bannedUser.profileId && loadingId !== bannedUser.id && (
                                <div className="ml-auto">
                                </div>
                            )}
                            {loadingId !== bannedUser.id && (
                                <Button onClick={() => onUnban(bannedUser.id)}>
                                    <ShieldMinus className='h-4 w-4 text-zinc-500'/>
                                </Button>
                                
                            )}
                            {loadingId === bannedUser.id && (
                                    <Loader2
                                    className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                            )}
                        </div>
                    ))}

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}