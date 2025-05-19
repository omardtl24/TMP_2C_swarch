'use client'

import { useEffect, useState } from 'react'
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
import ModalFormBase, { useModal } from "@/components/ModalFormBase"
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
    name: z
        .string()
        .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
        .max(50, { message: 'La descripción no puede exceder 50 caracteres' })
        .nonempty({ message: 'La descripción es obligatoria' }),
    amount: z
        .number({ required_error: "El monto es obligatorio", invalid_type_error: "Debe ser un número" })
        .min(1, { message: 'El monto debe ser mayor a 0' }),
    category: z
        .string()
        .min(1, { message: 'Seleccione una categoría' }),
    paidBy: z
        .string()
        .min(1, { message: 'Seleccione quién paga' }),
    participants: z
        .array(z.string())
        .min(1, { message: 'Seleccione al menos un participante' }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface FormCreateExpenseProps {
    eventId?: string;
    participants: { id: string; name: string }[];
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
            name: '',
            amount: undefined,
            category: '',
            paidBy: '',
            participants: [],
        },
        mode: "onSubmit",
    });

    const [loading, setLoading] = useState(false);
    const { closeModal, openModal } = useModal(modalId);

    // Add useEffect to handle external open state
    useEffect(() => {
        if (open) {
            openModal();
        }
    }, [open, openModal]);

    // Handle form submission
    const onSubmit = async (values: ExpenseFormValues) => {
        try {
            setLoading(true);
            
            // Call the GraphQL mutation to create a new expense
            const response = await createExpense(
                eventId || "0", // Use the provided eventId or a fallback
                {
                    name: values.name,
                    amount: values.amount,
                    category: values.category,
                    paidById: values.paidBy,  // ID of the person paying
                    participantIds: values.participants // Array of participant IDs
                }
            );
            
            if (!response.success) {
                throw new Error(response.error || "Failed to create expense");
            }
            
            // Call the callback with the returned data
            if (onExpenseCreated && response.data) {
                onExpenseCreated(response.data);
            }
            
            closeModal();
            
            // Reset external open state if provided
            if (setOpen) {
                setOpen(false);
            }
            
            form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            // You could add a toast notification here for user feedback
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalFormBase
            id={modalId}
            title="Nuevo gasto"
            contentClassName="p-6 rounded-3xl bg-purple-100/40 overflow-y-auto max-h-[90vh] w-full " 
            headerClassName="text-center text-primary flex items-center justify-center w-full mb-2"
            icono={<Database className="mx-auto text-primary mb-2" />}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
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

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Valor
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="rounded-xl h-12"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
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
                                                        (category) => category.value === field.value
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
                                                {expenseCategories.map((category) => (
                                                    <CommandItem
                                                        key={category.value}
                                                        value={category.value}
                                                        onSelect={() => {
                                                            form.setValue("category", category.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === category.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {category.label}
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
                    
                    <FormField
                        control={form.control}
                        name="paidBy"
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
                                                            form.setValue("paidBy", participant.id);
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
                    
                    <FormField
                        control={form.control}
                        name="participants"
                        render={() => (
                            <FormItem>
                                <div className="mb-2">
                                    <FormLabel className="text-base">Participantes</FormLabel>
                                </div>
                                <div className="rounded-md border p-4 bg-white">
                                    {participants.map((participant) => (
                                        <FormField
                                            key={participant.id}
                                            control={form.control}
                                            name="participants"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={participant.id}
                                                        className="flex flex-row items-center space-x-3 space-y-0 py-1"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(participant.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValues = field.value || [];
                                                                    return checked
                                                                        ? field.onChange([...currentValues, participant.id])
                                                                        : field.onChange(
                                                                            currentValues.filter(
                                                                                (value) => value !== participant.id
                                                                            )
                                                                        );
                                                                }}
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {participant.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
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
