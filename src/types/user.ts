

declare global{
    namespace Express{
        interface Request{
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}


export enum UserRole{
    USER = "USER",
    ADMIN = "ADMIN"
}