/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalFormBase from "@/components/ModalFormBase";
import { EditPersonalExpensePayload, PersonalExpenseType } from "@/lib/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { createPersonalExpense, editPersonalExpense } from "@/lib/actions/personalExpensesActions";
import { Input } from "../ui/input";
import { ChevronsUpDown } from "lucide-react";
import { cn, expenseCategories, mapExpenseLabelToEnum } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const expenseFormSchema = z.object({
    concept: z
        .string()
        .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
        .max(50, { message: 'La descripción no puede exceder 50 caracteres' }),
    total: z
        .string()
        .min(1, { message: 'El monto es obligatorio' })
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, { message: 'El monto debe ser mayor a 0' }),
    type: z
        .string()
        .min(1, { message: 'Seleccione una categoría' }),
    date: z
        .date( { required_error: "La fecha de inicio es requerida"})
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface CreateExpenseFormProps {
    onExpenseCreated: (expense: PersonalExpenseType) => void;
    modalId?: string;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    initialData?: PersonalExpenseType | null;
    editMode?: boolean;
}

export default function CreateExpenseForm({
    modalId = "createPersonalExpense",
    open,
    setOpen,
    initialData,
    editMode = false,
}: CreateExpenseFormProps) {
    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: initialData ? {
            concept: initialData?.concept || '',
            total: initialData?.total.toString() || '',
            type: initialData?.type || '',
            date: initialData ? new Date(initialData.date) : new Date(),
        } : {
            concept: '',
            total: '',
            type: '',
            date: new Date(),
        }
    });

    
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formattedTotal, setFormattedTotal] = useState('');

    useEffect(() => {
        if (!open) {
            form.reset();
            setFormattedTotal('');
        } else if (initialData) {
            if (initialData.total) {
                const numericValue = String(initialData.total).replace(/\D/g, '');
                setFormattedTotal(
                    numericValue
                        ? Number(numericValue).toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })
                        : ''
                );
            }
            if (initialData.concept) form.setValue('concept', initialData.concept);
            if (initialData.type) form.setValue('type', initialData.type);
            if (initialData.date) form.setValue('date', new Date(initialData.date))
            if (initialData.total) form.setValue('total', initialData.total.toString());
        }
    }, [open, initialData, form]);

    const handleSubmit = async (data: ExpenseFormValues) => {
        setLoading(true);
        try {
            const totalNumber = Number(data.total);
            const expensePayload: EditPersonalExpensePayload = {
                concept: data.concept,
                total: totalNumber,
                type: mapExpenseLabelToEnum(data.type),
                date: data.date.toISOString().replace('Z', '+00:00'), // Convert to ISO string for consistency
            };
        if (editMode) {
            if (initialData && initialData.id) {
                await editPersonalExpense(initialData.id, expensePayload);
            } else {
                throw new Error("No se pudo editar el gasto, ID no encontrado");
            }
        } else {
            console.log("Creating new personal expense:", expensePayload);
            await createPersonalExpense({
                ...expensePayload
            } as PersonalExpenseType);
        }
        if (setOpen) setOpen(false);
        router.refresh();
        } catch (error) {
            console.error("Error al guardar el gasto:", error);
            alert("Error al guardar el gasto. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    function parseLocalDate(dateString: string): Date {
		const [year, month, day] = dateString.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

    return (
        <ModalFormBase
            id={modalId}
            open={open}
            setOpen={setOpen}
            title={editMode ? "Editar Gasto" : "Crear Gasto"}
        >
            <Form {...form}>
                <form onSubmit= {form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Descripción del gasto"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="total"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="$0"
                                        value={formattedTotal}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/\D/g, '');
                                            const formatted = numericValue ?
                                                Number(numericValue).toLocaleString('es-CO', {
                                                    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
                                                }) : '';
                                            setFormattedTotal(formatted);
                                            field.onChange(numericValue); // Update form state with raw number
                                        }}
                                        onBlur={field.onBlur}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <select
                                            className={cn("w-full h-12 appearance-none ...")}
                                            {...field}
                                        >
                                            <option value="" disabled>Selecciona una categoría</option>
                                            {expenseCategories.map((cat) => (
                                                <option key={cat.value} value={cat.label}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-base font-semibold">
                                    <div className="flex items-center gap-1">
                                        Fecha{" "}
                                        <span className="text-red-500">*</span>
                                    </div>
                                </FormLabel>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="rounded-xl bg-transparent h-12 pl-3 border-primary text-left font-normal w-full"
                                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                        onChange={(e) => {
                                            const date = e.target.value ? parseLocalDate(e.target.value) : null;
                                            if (date) field.onChange(date);
                                        }}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full ..." disabled={loading}>
                        {loading ? "Guardando..." : editMode ? "Actualizar Gasto" : "Crear Gasto"}
                    </Button>
                </form>
            </Form>
        </ModalFormBase>
    );
}
