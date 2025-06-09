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
                                className={`flex h-32 cursor-pointer flex-col items-start justify-start rounded-lg border p-2 duration-200 hover:bg-gray-200 hover:shadow-lg ${!isSameMonth(day, currentMonth) ? 'bg-gray-100 text-gray-400 dark:bg-gray-400' : ''} ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''} `}
                            >
                                <span className="text-sm font-semibold dark:text-black">{format(day, 'd', { locale: ptBR })}</span>
                                {/* Espaço para eventos ou conteúdo */}
                                <div className="mt-1 text-xs text-gray-600">
                                    {events
                                        ?.filter((event) => isSameDay(new Date(event.start_date), dayClone))
                                        .map((event) => (
                                            <div key={event.id} className="mb-1">
                                                <Link
                                                    href={'#'}
                                                    className="text-blue-600 transition-all duration-200 hover:font-bold hover:underline"
                                                >
                                                    {event.title}
                                                </Link>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{format(day, "cccc, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</h3>
                                <p className="mt-2 text-sm text-gray-600">Aqui você pode adicionar eventos ou detalhes para este dia.</p>
                                {/* Exemplo de conteúdo adicional */}
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
