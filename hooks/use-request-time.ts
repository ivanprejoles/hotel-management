import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseRequestTime {
    fiveMinutesInMilliSeconds: number;
    threeMinutesInMilliSeconds: number;
    clientRoomRequest: Date;
    adminRoomRequest: Date;
    onClientRoomRequest: () => void;
    onAdminRoomRequest: () => void;
}

export const useRequest = create<UseRequestTime>()(
    persist(
        (set) => ({
            fiveMinutesInMilliSeconds: 5 * 60 * 1000,
            threeMinutesInMilliSeconds: 3 * 60 * 1000,
            clientRoomRequest: new Date(),
            adminRoomRequest: new Date(),
            onClientRoomRequest: () => set({ clientRoomRequest: new Date() }),
            onAdminRoomRequest: () => set({ adminRoomRequest: new Date() }),
        }),
        {
                name: "request-storage", // unique name
                storage: {
                    getItem: (name) => {
                        const item = localStorage.getItem(name);
                        if (item) {
                            const parsed = JSON.parse(item);
                            return {
                                ...parsed,
                                state: {
                                    ...parsed.state,
                                    clientRoomRequest: new Date(parsed.state.clientRoomRequest),
                                    adminRoomRequest: new Date(parsed.state.adminRoomRequest)
                                }
                            };
                        }
                        return null;
                    },
                    setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
                    removeItem: (name) => localStorage.removeItem(name),
                },
        }
    )
);
