import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Globe, Instagram } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Events',
        href: '/event',
    },
];

export default function Index() {
    const props = usePage<{ initialDate?: string }>().props;

    const [initialDate, setInitialDate] = useState<Date | undefined>(props.initialDate ? new Date(`${props.initialDate}T00:00`) : undefined);
    const [finalDate, setFinalDate] = useState<Date | undefined>();
    const [localErrors, setLocalErrors] = useState<{ start_date?: string; end_date?: string }>({});

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        start_date: props.initialDate,
        end_date: '',
        responsible_phone: '',
        responsible_email: '',
        website_link: '',
        instagram_link: '',
        image: null as File | null,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (localErrors.start_date || localErrors.end_date) {
            return;
        }
        post(route('event.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Card className="m-6">
                <CardHeader className="font-serif text-lg font-bold">Create new event</CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 sm:flex-col md:flex-col lg:flex-row">
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Title</Label>
                                    <Input placeholder="Title of the event" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title}></InputError>
                                </div>
                                <div className="flex w-2xs flex-col gap-2">
                                    <Label>Location</Label>
                                    <Select onValueChange={(value) => setData('location', value)} defaultValue={data.location}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="casa_cultura" className="font-bold">
                                                Casa da Cultura
                                            </SelectItem>
                                            <SelectItem value="centro_cultural" className="font-bold">
                                                Centro Cultural
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.location}></InputError>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Description of the event"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    <InputError message={errors.description}></InputError>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Start date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-[280px] justify-start text-left font-normal',
                                                    !initialDate && 'text-muted-foreground',
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {initialDate ? format(initialDate, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto">
                                            <Calendar
                                                mode="single"
                                                selected={initialDate}
                                                onSelect={(date) => {
                                                    setInitialDate(date);
                                                    if (date) {
                                                        setData('start_date', format(date, 'yyyy-MM-dd'));

                                                        if (finalDate && date > finalDate) {
                                                            setLocalErrors((prev) => ({
                                                                ...prev,
                                                                start_date: 'The start date cannot be after the end date.',
                                                            }));
                                                        } else {
                                                            setLocalErrors((prev) => ({ ...prev, start_date: undefined }));
                                                        }
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {(localErrors.start_date || errors.start_date) && (
                                        <span className="text-sm font-bold text-red-500">{localErrors.start_date || errors.start_date}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>End date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-[280px] justify-start text-left font-normal', !finalDate && 'text-muted-foreground')}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {finalDate ? format(finalDate, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={finalDate}
                                                onSelect={(date) => {
                                                    setFinalDate(date);
                                                    if (date) {
                                                        setData('end_date', format(date, 'yyyy-MM-dd'));

                                                        if (initialDate && date < initialDate) {
                                                            setLocalErrors((prev) => ({
                                                                ...prev,
                                                                end_date: 'The end date cannot be before the start date.',
                                                            }));
                                                        } else {
                                                            setLocalErrors((prev) => ({ ...prev, end_date: undefined }));
                                                        }
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {(localErrors.end_date || errors.end_date) && (
                                        <span className="text-sm font-bold text-red-500">{localErrors.end_date || errors.end_date}</span>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <Card>
                                        <CardHeader className="font-serif font-bold">Event Links</CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col gap-4">
                                                <Label>Website</Label>
                                                <div className="flex items-center gap-2">
                                                    <Globe></Globe>
                                                    <Input
                                                        placeholder="http://example.com.br"
                                                        type="url"
                                                        onChange={(e) => setData('website_link', e.target.value)}
                                                    />
                                                    <InputError message={errors.website_link}></InputError>
                                                </div>
                                                <Label>Instagram</Label>
                                                <div className="flex items-center gap-2">
                                                    <Instagram></Instagram>
                                                    <Input
                                                        placeholder="http://example.com.br"
                                                        type="url"
                                                        onChange={(e) => setData('instagram_link', e.target.value)}
                                                    />
                                                    <InputError message={errors.instagram_link}></InputError>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Card>
                                        <CardHeader>
                                            <span className="text-md font-serif font-bold">Event Midia</span>
                                        </CardHeader>
                                        <CardContent className="flex flex-col">
                                            <div>
                                                <Label>{`Event Image (Banner, Post, Card, Folder, etc.)`}</Label>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            setData('image', file);
                                                        }
                                                    }}
                                                />
                                                <InputError message={errors.image}></InputError>

                                                <img
                                                    className="mt-2 h-80 w-full rounded-md border border-gray-300 object-contain"
                                                    src={data.image ? URL.createObjectURL(data.image) : '/event-placeholder.png'}
                                                    alt="Event Image Preview"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Card>
                                        <CardHeader className="font-serif font-bold">Responsible Information</CardHeader>
                                        <CardContent className="flex flex-col gap-2">
                                            <div className="mb-4 flex flex-col gap-2">
                                                <Label>Responsible phone</Label>
                                                <Input
                                                    type="tel"
                                                    placeholder="Responsible phone related to the event"
                                                    value={data.responsible_phone}
                                                    onChange={(e) => setData('responsible_phone', e.target.value)}
                                                />
                                                <InputError message={errors.responsible_phone}></InputError>
                                            </div>

                                            <div className="mb-4 flex flex-col gap-2">
                                                <Label>Responsible email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="Responsible email related to the event"
                                                    value={data.responsible_email}
                                                    onChange={(e) => setData('responsible_email', e.target.value)}
                                                />
                                                <InputError message={errors.responsible_email}></InputError>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="mt-4">
                            Save event
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
