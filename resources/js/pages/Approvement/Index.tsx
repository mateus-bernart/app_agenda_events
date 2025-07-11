import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Search, Settings, Trash } from 'lucide-react';
import { useState } from 'react';
import { Event, EventFormData } from '../Event/event-types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Approvement',
        href: '/approvement',
    },
];

type PageProps = {
    flash: {
        message?: string;
    };
    events: Event[];
};

export default function Index() {
    const { flash, events } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();
    const [query, setQuery] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);

    const { data, setData, put } = useForm<EventFormData>({
        event_id: 0,
        status: 'pending',
        approver_comment: '',
    });

    const handleDeleteEvent = (eventId: number) => {
        if (confirm('Are you sure you want to delete this event?')) {
            destroy(route('approvements.destroy', eventId));
        }
    };

    const handleApproveEvent = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(route('approvements.approval', data.event_id));
    };

    const filteredEvents = events.filter((event) => {
        return event.title.toLowerCase().includes(query.toLowerCase());
    });

    const filteredApprovedEvents = filteredEvents.filter((event) => {
        return event.status === 'pending' || event.status === 'rejected';
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-700';
            case 'rejected':
                return 'bg-red-700';
            case 'pending':
                return 'bg-amber-600';
        }
    };
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

            {filteredApprovedEvents.length > 0 ? (
                <div className="mx-4 mb-4 flex flex-wrap gap-4">
                    {filteredApprovedEvents.map((event) => (
                        <div className="w-full sm:w-[48%] md:w-[31%]" key={event.id}>
                            <Card
                                className="relative h-full transition-all duration-200 hover:shadow-xl dark:bg-gray-500 dark:hover:bg-gray-600 dark:hover:shadow-lg"
                                key={event.id}
                            >
                                <CardHeader className="font-bold">
                                    <CardTitle>{event.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-20 text-gray-500">
                                    <CardDescription className="mb-4 line-clamp-3">{event.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="mb-8 flex flex-col gap-2">
                                    <p>
                                        Start date: <span className="font-bold">{new Date(event.start_date).toLocaleDateString('pt-BR')}</span>
                                    </p>
                                    <p>
                                        End date: <span className="font-bold">{new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
                                    </p>
                                </CardFooter>
                                <Button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="absolute top-4 right-4 cursor-pointer bg-red-600 transition-all duration-200 hover:bg-red-800 hover:shadow-lg"
                                    disabled={processing}
                                >
                                    <Trash />
                                </Button>
                                <div
                                    className={`absolute right-0 bottom-0 rounded-tl-lg rounded-br-lg ${getStatusColor(event.status)} p-2 text-center text-white`}
                                >
                                    <span className="capitalize">{event.status}</span>
                                </div>
                                <Dialog open={openModal} onOpenChange={setOpenModal}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => {
                                                setData({
                                                    event_id: event.id,
                                                    status: event.status,
                                                    approver_comment: event.approver_comment ?? '', // handle undefined/null
                                                });
                                                setOpenModal(true);
                                            }}
                                            className="absolute top-4 right-16 cursor-pointer bg-gray-600 transition-all duration-200 hover:bg-gray-800 hover:shadow-lg dark:bg-gray-300 dark:hover:bg-gray-400"
                                            disabled={processing}
                                        >
                                            <Settings />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <form onSubmit={handleApproveEvent}>
                                            <DialogHeader>
                                                <DialogTitle>Manage Approvement</DialogTitle>
                                                <DialogDescription></DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="status" className="text-right">
                                                        Status
                                                    </Label>
                                                    <Select onValueChange={(value) => setData('status', value)} defaultValue={data.status}>
                                                        <SelectTrigger id="status" className="col-span-3 cursor-pointer">
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="approved" className="cursor-pointer hover:bg-gray-100">
                                                                Approved
                                                            </SelectItem>
                                                            <SelectItem value="rejected" className="cursor-pointer hover:bg-gray-100">
                                                                Rejected
                                                            </SelectItem>
                                                            <SelectItem value="pending" className="cursor-pointer hover:bg-gray-100">
                                                                Pending
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="comment" className="text-right">
                                                        Comment
                                                    </Label>
                                                    <Input
                                                        id="comment"
                                                        placeholder="Enter a comment"
                                                        className="col-span-3"
                                                        value={data.approver_comment}
                                                        onChange={(e) => setData('approver_comment', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    className="cursor-pointer"
                                                    disabled={processing}
                                                    onClick={() => setOpenModal(false)}
                                                >
                                                    Save changes
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
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
