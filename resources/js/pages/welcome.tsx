import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import { User } from '@/types/user';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Event } from './Event/event-types';

type PageProps = {
    events: Event[];
    user: User;
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { events, user } = usePage<PageProps>().props;

    console.log(user);

    const [query, setQuery] = useState<string>('');

    const filteredEvents = events.filter((event: any) => {
        return event.title.toLowerCase().includes(query.toLowerCase());
    });

    const filteredApprovedEvents = filteredEvents.filter((event: any) => {
        return event.status === 'approved';
    });

    return (
        <>
            <div className="relative h-screen w-full">
                <img
                    src="background.png"
                    alt="Background"
                    className="absolute inset-0 z-0 h-full w-full object-cover"
                    style={{ opacity: 0.9, pointerEvents: 'none' }}
                />
                <Head title="Welcome">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                </Head>
                <div className="relative z-10 flex min-h-screen flex-col items-center p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-transparent">
                    <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                        <nav className="flex items-center justify-end gap-4">
                            <div className="rounded-md bg-white p-2 shadow-md dark:bg-[#191400]">
                                {auth.user && user.user_type === 'admin' ? (
                                    <div>
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-lg leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-lg leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </header>

                    <div className="flex w-full flex-col items-center justify-center gap-4 opacity-100 transition-opacity duration-750 starting:opacity-0">
                        <Card className="relative flex w-full max-w-6xl flex-col">
                            <img src="logo1.png" alt="logo" width={100} height={100} className="absolute top-1 right-1" />

                            <div>
                                <CardHeader className="font-serif text-xl font-bold">Upcoming events</CardHeader>

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
                            </div>

                            <CardContent>
                                {filteredApprovedEvents.length > 0 ? (
                                    <div className="mx-4 mb-4 flex flex-wrap gap-4">
                                        {filteredApprovedEvents.map((event) => (
                                            <div className="w-full sm:w-[48%] md:w-[31%]" key={event.id}>
                                                <Card className="relative h-full" key={event.id}>
                                                    <CardHeader className="font-bold">
                                                        <CardTitle>{event.title}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="h-20 text-gray-500">
                                                        <CardDescription className="mb-4 line-clamp-3">{event.description}</CardDescription>
                                                    </CardContent>
                                                    <CardFooter className="flex flex-col gap-2">
                                                        <p>
                                                            Start date:{' '}
                                                            <span className="font-bold">
                                                                {new Date(event.start_date).toLocaleDateString('pt-BR')}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            End date:{' '}
                                                            <span className="font-bold">{new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
                                                        </p>
                                                    </CardFooter>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="mx-4">No events found</span>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="hidden h-14.5 lg:block"></div>
                </div>
            </div>
        </>
    );
}
