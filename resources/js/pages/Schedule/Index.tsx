import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { Event } from './event-types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Schedule',
        href: '/schedule',
    },
];

type PageProps = {
    flash: {
        message?: string;
    };
    events: Event[];
};

export default function Dashboard() {
    const { flash, events } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();
    const [query, setQuery] = useState<string>('');

    const handleDeleteEvent = (eventId: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            destroy(route('schedule.destroy', eventId));
        }
    };

    const filteredEvents = events.filter((event) => {
        return event.title.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {flash.message && (
                <Alert className="mx-4 mt-4 max-w-70 bg-green-100">
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}
            <div className="m-4 flex w-1/2 items-center gap-2">
                <Search />
                <Input
                    placeholder="Search event"
                    className=""
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                ></Input>
            </div>
            <div className="mb-4 ml-4">
                <Link href={route('schedule.create')}>
                    <Button>Add event</Button>
                </Link>
            </div>
            {filteredEvents.length > 0 ? (
                <div className="mx-4 mb-4 flex flex-wrap gap-4">
                    {filteredEvents.map((event) => (
                        <div className="w-full sm:w-[48%] md:w-[31%]">
                            <Card className="relative h-full" key={event.id}>
                                <CardHeader className="font-bold">
                                    <CardTitle>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-20 text-gray-500">
                                    <CardDescription className="mb-4 line-clamp-3">{event.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <p>
                                        Start date: <span className="font-bold">{new Date(event.start_date).toLocaleDateString('pt-BR')}</span>
                                    </p>
                                    <p>
                                        End date: <span className="font-bold">{new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
                                    </p>
                                </CardFooter>
                                <Button onClick={() => handleDeleteEvent(event.id)} className="absolute top-4 right-4" disabled={processing}>
                                    <Trash />
                                </Button>
                            </Card>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="mx-4">No events found</span>
            )}
        </AppLayout>
    );
}
