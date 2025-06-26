import { createContext } from 'react';

export interface UserData {
    _id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    isAdmin?: boolean;
    balance?: number;
    isActive?: boolean;
    typeLogin?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ContextType {
    dataUser: UserData;
    fetchAuth: () => void;
}

const Context = createContext<ContextType>({
    dataUser: {},
    fetchAuth: () => {},
});

export default Context;
