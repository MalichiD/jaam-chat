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
import { useRouter } from "next/navigation";


export const DeleteServerModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === "deleteServer";
    const {server} = data;
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try{
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.refresh();
            router.push("/")
        } catch (error){
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete <span className="font-semibold text-indigo-500">{server?.name}</span>? 
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
                        variant="destructive"
                        onClick={onClick}>
                            Confirm
                        </Button>

                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}