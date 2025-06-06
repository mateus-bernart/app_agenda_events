export type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: Date;
    end_date: Date;
    status: string;
    approver_comment: string;
    website_link: string;
    instagram_link: string;
    image: string;
};

export type EventFormData = {
    event_id: number;
    status: string;
    approver_comment: string;
};
