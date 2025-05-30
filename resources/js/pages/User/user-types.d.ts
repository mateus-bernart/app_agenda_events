export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    user_type: string;
};

export type UserFormData = {
    user_id: number | null;
    name: string;
    email: string;
    user_type: string;
};
