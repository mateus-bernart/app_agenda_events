import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { SelectValue } from '@radix-ui/react-select';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import React from 'react';

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
    const [initialDate, setInitialDate] = React.useState<Date>();
    const [finalDate, setFinalDate] = React.useState<Date | undefined>();
    const [localErrors, setLocalErrors] = React.useState<{ start_date?: string; end_date?: string }>({});

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
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
                {/* Error message */}
                {Object.keys(errors).length > 0 && (
                    <Alert className="mx-6 max-w-80 bg-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle> Heads up!</AlertTitle>
                        <AlertDescription>
                            {Object.entries(errors).map(([key, message]) => (
                                <li>{message as string}</li>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex h-full w-1/2 flex-1 flex-col gap-4 rounded-xl">
                            <div className="flex flex-col gap-2">
                                <Label>Title</Label>
                                <Input placeholder="Title of the event" value={data.title} onChange={(e) => setData('title', e.target.value)} />
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Description of the event"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Start date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-[280px] justify-start text-left font-normal', !initialDate && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {initialDate ? format(initialDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
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
                                            {finalDate ? format(finalDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
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
