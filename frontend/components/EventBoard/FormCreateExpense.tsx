'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Database } from 'lucide-react'

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import ModalFormBase from "@/components/ModalFormBase"
import { ExpenseType } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import { Checkbox } from '@/components/ui/checkbox'
import { createExpense } from '@/lib/actions/eventActions'

// Sample data for categories
const expenseCategories = [
    { label: "Comida", value: "comida" },
    { label: "Bebida", value: "bebida" },
    { label: "Transporte", value: "transporte" },
    { label: "Alojamiento", value: "alojamiento" },
    { label: "Entretenimiento", value: "entretenimiento" },
    { label: "Compras", value: "compras" },
    { label: "Otros", value: "otros" },
]

// Schema definition with zod
const expenseFormSchema = z.object({
    concept: z
        .string()
        .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
        .max(50, { message: 'La descripción no puede exceder 50 caracteres' })
        .nonempty({ message: 'La descripción es obligatoria' }),
    total: z
        .string()
        .min(1, { message: 'El monto es obligatorio' })
        .refine(val => {
            const numericValue = val.replace(/\D/g, '');
            return !isNaN(Number(numericValue)) && Number(numericValue) > 0;
        }, { message: 'El monto debe ser mayor a 0' }),
    type: z
        .string()
        .min(1, { message: 'Seleccione una categoría' }),
    payer_id: z
        .string() // Changed from number to string
        .min(1, { message: 'Seleccione quién paga' }),
    participants: z
        .array(z.string()) // Changed from array of numbers to array of strings
        .min(1, { message: 'Seleccione al menos un participante' }),
}).refine(data => data.participants.includes(data.payer_id), {
    message: "El pagador debe ser incluido como participante",
    path: ["participants"],
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface FormCreateExpenseProps {
    eventId?: string;
    participants: { id: string; name: string }[]; // Changed id type to string
    onExpenseCreated?: (expense: ExpenseType) => void;
    modalId?: string;
    open?: boolean; 
    setOpen?: (value: boolean) => void;
}

export default function FormCreateExpense({
    eventId,
    participants,
    onExpenseCreated,
    modalId = 'createExpense',
    open,
    setOpen
}: FormCreateExpenseProps) {
    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            concept: '',
            total: '',
            type: '',
            payer_id: "",
            participants: [],
        },
        mode: "onChange",
    });

    const [loading, setLoading] = useState(false);
    const [formattedtotal, setFormattedtotal] = useState('');

    // Reset the form when the modal is closed
    useEffect(() => {
        if (!open) {
            form.reset();
            setFormattedtotal('');
        }
    }, [open, form]);

    // Handle form submission
    const onSubmit = async (values: ExpenseFormValues) => {
        try {
            setLoading(true);
            console.log("Submitting form with values expenses:", values);
            
            // Create expense with GraphQL mutation
            const response = await createExpense(
                eventId || "0", 
                {
                    name: values.concept,
                    total: Number(values.total.replace(/\D/g, '')),
                    type: values.type,
                    payer_id: values.payer_id,
                    participants: values.participants
                }
            );
            
            if (!response.success) {
                throw new Error(response.error || "Failed to create expense");
            }
            
            // Update UI with new expense
            if (onExpenseCreated && response.data) {
                onExpenseCreated(response.data);
            }
            
            // Close modal and reset form
            if (setOpen) setOpen(false);
            form.reset();
            setFormattedtotal('');
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalFormBase
            id={modalId}
            title="Nuevo gasto"
            contentClassName="p-6 rounded-3xl bg-purple-100/40 overflow-y-auto max-h-[90vh] w-full"
            headerClassName="text-center text-primary flex items-center justify-center w-full mb-2"
            icono={<Database className="mx-auto text-primary mb-2" />}
            open={open}
            setOpen={setOpen}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name field */}
                    <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Motivo del gasto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="¿En qué gastaste?"
                                        className="rounded-xl h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* total field */}
                    <FormField
                        control={form.control}
                        name="total"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Valor
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="$0"
                                        className="rounded-xl h-12"
                                        value={formattedtotal}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/\D/g, '');
                                            const formatted = numericValue ? 
                                                Number(numericValue).toLocaleString('es-CO', {
                                                    style: 'currency',
                                                    currency: 'COP',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                }) : '';
                                            
                                            setFormattedtotal(formatted);
                                            field.onChange(numericValue);
                                        }}
                                        onBlur={field.onBlur}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* type field */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                    Tipo
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between rounded-xl h-12 pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? expenseCategories.find(
                                                        (type) => type.value === field.value
                                                    )?.label
                                                    : "Selecciona una categoría"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar categoría..." />
                                            <CommandEmpty>No se encontró.</CommandEmpty>
                                            <CommandGroup>
                                                {expenseCategories.map((type) => (
                                                    <CommandItem
                                                        key={type.value}
                                                        value={type.value}
                                                        onSelect={() => {
                                                            form.setValue("type", type.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === type.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {type.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {/* Payer field */}
                    <FormField
                        control={form.control}
                        name="payer_id"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base">
                                    ¿Quién paga?
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between rounded-xl h-12 pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? participants.find(p => p.id === field.value)?.name
                                                    : "Selecciona quién paga"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar participante..." />
                                            <CommandEmpty>No se encontró.</CommandEmpty>
                                            <CommandGroup>
                                                {participants.map((participant) => (
                                                    <CommandItem
                                                        key={participant.id}
                                                        
                                                        value={participant.id}
                                                        onSelect={() => {
                                                            form.setValue("payer_id", participant.id);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === participant.id
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {participant.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {/* Participants field */}
                    <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center mb-2">
                                    <FormLabel className="text-base">Participantes</FormLabel>
                                </div>
                                <div className="rounded-md border p-4 bg-white">
                                    {participants.map((participant) => (
                                        <div key={participant.id} className="flex flex-row items-center space-x-3 space-y-0 py-1">
                                            <Checkbox
                                                id={`participant-${participant.id}`}
                                                checked={field.value?.includes(participant.id)}
                                                onCheckedChange={(checked) => {
                                                    const currentValues = [...field.value || []];
                                                    
                                                    if (checked) {
                                                        if (!currentValues.includes(participant.id)) {
                                                            currentValues.push(participant.id);
                                                        }
                                                    } else {
                                                        const index = currentValues.indexOf(participant.id);
                                                        if (index !== -1) {
                                                            currentValues.splice(index, 1);
                                                        }
                                                    }
                                                    
                                                    field.onChange(currentValues);
                                                }}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <label
                                                htmlFor={`participant-${participant.id}`}
                                                className="font-normal cursor-pointer"
                                            >
                                                {participant.name}
                                                {participant.id === form.getValues("payer_id") && (
                                                    <span className="ml-2 text-xs text-primary">(Cajero)</span>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button 
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 text-lg"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Listo"}
                    </Button>
                </form>
            </Form>
        </ModalFormBase>
    );
}
