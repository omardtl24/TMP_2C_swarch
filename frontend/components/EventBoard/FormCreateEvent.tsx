'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ModalFormBase from "@/components/ModalFormBase"


// Schema definition with zod
const eventFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
        .max(50, { message: 'El nombre no puede exceder 50 caracteres' })
        .nonempty({ message: 'El nombre es obligatorio' }),
    beginDate: z.date({
        required_error: 'La fecha de inicio es requerida',
    }),
    endDate: z.date({
        required_error: 'La fecha de finalización es requerida',
    }),
}).refine(data => data.endDate >= data.beginDate, {
    message: "La fecha de finalización debe ser posterior a la fecha de inicio",
    path: ["endDate"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface FormCreateEventProps {
    defaultBeginDate?: Date;
    modalId?: string;
    open?: boolean; 
    setOpen?: (value: boolean) => void;
}

const FormCreateEvent = ({
    defaultBeginDate,
    modalId = 'createEvent',
    open,
    setOpen

}: FormCreateEventProps) => {

    console.log("fecha seleccionada", defaultBeginDate);
    
    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            name: '',
            beginDate: new Date(), // Use a default date initially
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), 
        },
        mode: "onSubmit", 
    });

    // Update form values when defaultBeginDate changes
    useEffect(() => {
        if (defaultBeginDate && open) {
            console.log("Setting form values with date:", defaultBeginDate);
            
            // Ensure the date is a valid Date object
            const beginDate = new Date(defaultBeginDate);
            form.setValue("beginDate", beginDate);
            
            // Set end date to one day after begin date
            const endDate = new Date(beginDate);
            endDate.setDate(endDate.getDate() + 1);
            form.setValue("endDate", endDate);
        }
    }, [defaultBeginDate, form, open]);

    const [loading, setLoading] = useState(false);

    // Handle form submission
    const onSubmit = async (values: EventFormValues) => {
        try {
            console.log("Form values:", values);
            setLoading(true);
            
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert(`Event created: ${JSON.stringify(values)}`);
            
            // Update external state if provided
            if (setOpen) {
                setOpen(false);
            }
            
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalFormBase
            id={modalId}
            title="Crea tu Evento"
            contentClassName="p-6 rounded-3xl" 
            headerClassName="text-center text-primary-20 text-3xl flex items-center justify-center w-full space-y-2"
            open={open}
            setOpen={setOpen}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">
                                    Nombre evento <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Escribe el nombre del evento"
                                        className="rounded-xl h-12"
                                        required
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="beginDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base font-semibold">
                                        <div className="flex items-center gap-1">
                                            <span className="text-primary">1</span> Fecha Inicio <span className="text-red-500">*</span>
                                        </div>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl bg-transparent h-12 pl-3 border-primary text-left font-normal"
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base font-semibold">
                                        <div className="flex items-center gap-1">
                                            <span className="text-primary">2</span> Fecha Fin <span className="text-red-500">*</span>
                                        </div>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-xl bg-transparent border-primary h-12 pl-3 text-left font-normal"
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                
                                                locale={es}
                                                disabled={(date) => date < form.getValues("beginDate")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Replace ModalSubmitButton with regular Button */}
                    <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 text-lg"
                        disabled={loading}
                    >
                        {loading ? "Creando..." : "Listo"}
                    </Button>
                </form>
            </Form>
        </ModalFormBase>
    );
};

export default FormCreateEvent;

// Create a trigger component for easier use
