import GeneralCalendar from '@/components/calendar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Event } from './Event/event-types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { events } = usePage().props as unknown as { events: Event[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center justify-between p-4">
                <h1 className="font-serif text-2xl font-semibold">General agenda</h1>
                <p className="text-sm text-gray-500">This is your events overview.</p>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 pt-0">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <GeneralCalendar events={events} />
                </div>
            </div>
        </AppLayout>
    );
}
