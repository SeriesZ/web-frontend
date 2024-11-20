import { create } from "zustand";

// 기본값
const defaultUserInfo = {
    id: "",
    name: "",
    email: "",
    role: "비회원",
    groupId: "",
    exp: "",
    bearer: "xxxx"
};

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;
    groupId: string;
    exp: string;
    bearer?: string;
}

interface Store {
    userInfo: UserInfo;

    setUserInfo: (data: UserInfo) => void;
    removeUserInfo: () => void;
}

const userLoginInfo = create<Store>((set) => ({
    userInfo: defaultUserInfo,

    setUserInfo: (data) => set({ userInfo: data }),
    removeUserInfo: () => set({ userInfo: defaultUserInfo }),
}));

export default userLoginInfo;
