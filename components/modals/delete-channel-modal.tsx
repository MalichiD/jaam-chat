"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import {useOrigin} from '@/hooks/use-origin'
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";


export const DeleteChannelModal = () => {

    const {onOpen, isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === "deleteChannel";
    const {server, channel} = data;
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try{
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            });
            await axios.delete(url);

            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        } catch (error){
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        The channel <span className="fonts-semibold text-indigo-500">#{channel?.name}</span> will be permanently deleted. 
                        <br/><span className="text-semibold text-rose-900">This action cannot be undone.</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                        disabled={isLoading}
                        onClick={() => {onClose()}}
                        variant="ghost">
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={onClick}>
                            Confirm
                        </Button>

                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}