'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
import ModalFormBase from "@/components/ModalFormBase"
import { ExpenseType, ParticipantType, DataExpense, ExpenseParticipation, ExpenseDetailedType, EditExpensePayload } from '@/lib/types'
import { cn, mapExpenseLabelToEnum } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { createExpense, editExpense } from '@/lib/actions/expenseActions'
import { expenseCategories } from '@/lib/utils'
import { getErrorMessage } from '@/lib/utils/errorHelpers'

// Schema definition for form validation
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
    payer_id: z
        .string()
        .min(1, { message: 'Seleccione quién paga' }),
    participants: z
        .array(z.string())
        .min(1, { message: 'Debe seleccionar al menos un participante' })
}).refine(data => data.participants.includes(data.payer_id), {
    message: "El pagador debe ser incluido como participante",
    path: ["participants"],
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface FormCreateExpenseProps {
    eventId: string;
    participants: ParticipantType[]; // Correctly typed to receive participant names and IDs
    onExpenseCreated?: (expense: ExpenseType) => void;
    modalId?: string;
    open?: boolean;
    setOpen?: (value: boolean) => void;
    initialValues?: ExpenseDetailedType // Add initialValues for edit
    editMode?: boolean; // Add editMode flag
}

export default function FormCreateExpense({
    eventId,
    participants,
    modalId = 'createExpense',
    open,
    setOpen,
    initialValues,
    editMode = false
}: FormCreateExpenseProps) {
    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: initialValues ? {
            concept: initialValues.concept || '',
            total: initialValues.total ? String(initialValues.total) : '',
            type: initialValues.type || '',
            payer_id: initialValues.payer_id || '',
            participants: initialValues.participation?.map(p => p.user_id) || [],
        } : {
            concept: '',
            total: '',
            type: '',
            payer_id: "",
            participants: [],
        },
        mode: "onChange",
    });

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formattedTotal, setFormattedTotal] = useState('');

    useEffect(() => {
        if (!open) {
            form.reset();
            setFormattedTotal('');
        } else if (initialValues) {
            // Set formattedTotal for edit mode
            if (initialValues.total) {
                const numericValue = String(initialValues.total).replace(/\D/g, '');
                setFormattedTotal(
                    numericValue
                        ? Number(numericValue).toLocaleString('es-CO', {
                            style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
                        })
                        : ''
                );
            }
            // Set all fields for edit mode
            if (initialValues.concept) form.setValue('concept', initialValues.concept);
            if (initialValues.type) form.setValue('type', initialValues.type);
            if (initialValues.payer_id) form.setValue('payer_id', initialValues.payer_id);
            if (initialValues.participation) form.setValue('participants', initialValues.participation.map(p => p.user_id));
            if (initialValues.total) form.setValue('total', String(initialValues.total));
        }
    }, [open, form, initialValues]);

    const onSubmit = async (values: ExpenseFormValues) => {
        setLoading(true);
        try {
            const totalNumber = Number(values.total);
            const participationPayload: ExpenseParticipation[] = values.participants.map(userId => ({
                user_id: userId,
                state: 0,
                portion: totalNumber / values.participants.length,
            }));
            const participationApiPayload: EditExpensePayload["participation"] = participationPayload.map(({ user_id, ...p }) => ({
                userId: user_id,
                ...p,
            }));
            const expensePayload: DataExpense = {
                event_id: eventId,
                concept: values.concept,
                total: totalNumber,
                type: mapExpenseLabelToEnum(values.type),
                payer_id: values.payer_id,
                participation: participationPayload,
            };
            console.log('editMode:', editMode, 'initialValues:', initialValues);
            if (editMode) {
                if (initialValues && initialValues.id) {
                    console.log('Calling editExpense with id:', initialValues.id);
                    await editExpense(initialValues.id, {
                        concept: values.concept,
                        total: totalNumber,
                        type: mapExpenseLabelToEnum(values.type),
                        payerId: values.payer_id,
                        participation: participationApiPayload,
                    } as EditExpensePayload);
                } else {
                    throw new Error('No se puede editar: falta el id del gasto.');
                }
            } else {
                // Create mode
                await createExpense(expensePayload);
            }
            if (setOpen) setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalFormBase
            id={modalId}
            title={editMode ? "Editar gasto" : "Nuevo gasto"}
            open={open}
            setOpen={setOpen}
            // Additional props for styling...
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Concept Field */}
                    <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Motivo del gasto</FormLabel>
                                <FormControl>
                                    <Input placeholder="¿En qué gastaste?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Total Field */}
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

                    {/* Type Field */}
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

                    {/* Payer Field */}
                    <FormField
                        control={form.control}
                        name="payer_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>¿Quién paga?</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <select
                                            className={cn("w-full h-12 appearance-none ...")}
                                            {...field}
                                        >
                                            <option value="" disabled>Selecciona quién paga</option>
                                            {participants.map((p) => (
                                                <option key={p.participant_id} value={p.participant_id}>
                                                    {p.participant_name} {/* Display name */}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Participants Field */}
                    <FormField
                        control={form.control}
                        name="participants"
                        render={() => (
                            <FormItem>
                                <FormLabel>Participantes</FormLabel>
                                <div className="rounded-md border p-4 bg-white">
                                    {participants.map((p) => (
                                        <FormField
                                            key={p.participant_id}
                                            control={form.control}
                                            name="participants"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center space-x-3 py-1">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(p.participant_id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, p.participant_id])
                                                                    : field.onChange(field.value?.filter(id => id !== p.participant_id));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        {p.participant_name} {/* Display name */}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full ..." disabled={loading}>
                        {loading ? "Guardando..." : "Listo"}
                    </Button>
                </form>
            </Form>
        </ModalFormBase>
    );
}