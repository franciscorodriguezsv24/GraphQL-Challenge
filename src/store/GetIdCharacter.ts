import { create } from "zustand";

type Elements = {
    id: string;
    selectedIdCharacter: (newId: string) => void;
}

export const useIdCharacter = create<Elements>((set) => ({
    id: "0",
    selectedIdCharacter: (newId: string) => set(() => ({id: newId}))
}))