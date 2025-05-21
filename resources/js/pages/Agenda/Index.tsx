import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Megaphone, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Agenda',
        href: '/agenda',
    },
];

type Event = {
    id: number;
    title: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
};

type PageProps = {
    flash: {
        message?: string;
    };
    events: Event[];
};

export default function Dashboard() {
    const { flash, events } = usePage<PageProps>().props;

    const handleDeleteEvent = (eventId: number) => {
        // Implement the delete event logic here
        console.log(`Deleting event with ID: ${eventId}`);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {flash.message && (
                <Alert className="mx-4 mt-4 max-w-70">
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Link href={route('agenda.create')}>
                    <Button>Add event</Button>
                </Link>
            </div>
            {events.length > 0 && (
                <div className="flex flex-col gap-4">
                    {events.map((event) => (
                        <Card className="relative mx-4">
                            <CardHeader className="font-bold">{event.title}</CardHeader>
                            <CardContent className="text-gray-500">{event.description}</CardContent>
                            <Button onClick={() => handleDeleteEvent(event.id)} className="absolute top-4 right-4">
                                <Trash />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
