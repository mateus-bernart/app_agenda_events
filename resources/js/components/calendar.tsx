// components/CustomCalendar.tsx
import { Event } from '@/pages/Event/event-types';
import { Link } from '@inertiajs/react';
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type GeneralCalendarProps = {
    events?: Event[];
};

export default function GeneralCalendar({ events }: GeneralCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const renderDays = () => {
        const days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const dayClone = day;
                days.push(
                    <Popover>
                        <PopoverTrigger asChild>
                            <div
                                key={day.toISOString()}
                                className={`flex h-20 w-full cursor-pointer flex-col items-start justify-start rounded-lg border p-2 duration-200 hover:bg-gray-200 hover:shadow-lg sm:h-32 ${!isSameMonth(day, currentMonth) ? 'bg-gray-100 text-gray-400 dark:bg-gray-400' : ''} ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''} `}
                            >
                                <span className="text-sm font-semibold dark:text-black">{format(day, 'd', { locale: ptBR })}</span>
                                {/* Espaço para eventos ou conteúdo */}
                                <div className="mt-1 text-xs text-gray-600">
                                    {window.innerWidth > 768 ? (
                                        <>
                                            {events
                                                ?.filter((event) => isSameDay(new Date(event.start_date), dayClone) && event.status !== 'rejected')
                                                .slice(0, 2)
                                                .map((event, index) => (
                                                    <div
                                                        key={index}
                                                        className={`mb-1 rounded p-1 ${
                                                            event.status === 'approved'
                                                                ? 'bg-green-100 text-base font-bold text-green-600'
                                                                : event.status === 'pending'
                                                                  ? 'bg-amber-100 text-base font-bold text-amber-600'
                                                                  : ''
                                                        }`}
                                                    >
                                                        <Link
                                                            href={
                                                                event.status === 'approved'
                                                                    ? route('event.index', event.id)
                                                                    : route('approvements.index')
                                                            }
                                                            className="block w-24 overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 hover:font-bold hover:underline"
                                                        >
                                                            {event.title}
                                                        </Link>
                                                    </div>
                                                ))}

                                            {(() => {
                                                const visibleEvents = events?.filter(
                                                    (event) => isSameDay(new Date(event.start_date), dayClone) && event.status !== 'rejected',
                                                );
                                                if (visibleEvents && visibleEvents.length > 2) {
                                                    return <div className="mt-1 text-xs text-gray-600">+ {visibleEvents.length - 2} more events</div>;
                                                }
                                                return null;
                                            })()}
                                        </>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {events &&
                                                events?.filter(
                                                    (event) => isSameDay(new Date(event.start_date), dayClone) && event.status === 'approved',
                                                ).length > 0 && (
                                                    <div className="flex h-5 w-7 items-center justify-center rounded-full bg-green-200">
                                                        <span className="font-sans text-base font-semibold">
                                                            {
                                                                events?.filter(
                                                                    (event) =>
                                                                        isSameDay(new Date(event.start_date), dayClone) &&
                                                                        event.status === 'approved',
                                                                ).length
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            <div>
                                                {events &&
                                                    events?.filter(
                                                        (event) => isSameDay(new Date(event.start_date), dayClone) && event.status === 'pending',
                                                    ).length > 0 && (
                                                        <div className="flex h-5 w-7 items-center justify-center rounded-full bg-amber-200">
                                                            <span className="font-sans text-base font-semibold">
                                                                {
                                                                    events?.filter(
                                                                        (event) =>
                                                                            isSameDay(new Date(event.start_date), dayClone) &&
                                                                            event.status === 'pending',
                                                                    ).length
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{format(day, "cccc, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</h3>
                                <p className="mt-2 text-sm text-gray-600">Aqui você pode adicionar eventos ou detalhes para este dia.</p>
                                {/* Exemplo de conteúdo adicional */}
                                <div className="mt-2">
                                    {events
                                        ?.filter((event) => isSameDay(new Date(event.start_date), dayClone))
                                        .map((event, index) => {
                                            if (event.status === 'rejected') return null;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`mb-1 rounded p-1 ${event.status === 'approved' ? 'bg-green-100 text-green-600' : event.status === 'pending' ? 'bg-amber-100 text-amber-600' : ''}`}
                                                >
                                                    <Link
                                                        href={'#'}
                                                        className="block w-full overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 hover:font-bold hover:underline"
                                                    >
                                                        {event.title}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="mt-4">
                                    <Link href={route(`event.create`, { date: format(day, 'yyyy-MM-dd') })} className="text-blue-600 hover:underline">
                                        Adicionar Evento
                                    </Link>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>,
                );
                day = addDays(day, 1);
            }
        }
        return days;
    };

    return (
        <div className="mx-auto max-w-5xl p-4">
            {/* Cabeçalho de Navegação */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button onClick={handlePrevMonth} className="h-10 w-15 cursor-pointer rounded px-2 py-1 hover:bg-gray-300">
                        ←
                    </Button>
                    <Button onClick={() => setCurrentMonth(new Date())} className="h-10 w-15 cursor-pointer rounded px-2 py-1 hover:bg-gray-300">
                        Hoje
                    </Button>
                </div>
                <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h2>
                <Button onClick={handleNextMonth} className="h-10 w-15 cursor-pointer rounded px-2 py-1 hover:bg-gray-300">
                    →
                </Button>
            </div>

            {/* Cabeçalho dos dias da semana */}
            <div className="mb-2 grid grid-cols-7 text-center text-sm font-semibold">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-2">{renderDays()}</div>
        </div>
    );
}
