"use client";

import {CreateServerModal} from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";

//Modal Provider to avoid hydration issues
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) return null;

    
    return (
        <>
            <CreateServerModal />
            <InviteModal />
        </>
    )
}