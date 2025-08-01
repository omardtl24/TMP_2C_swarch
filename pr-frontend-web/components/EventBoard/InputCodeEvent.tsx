'use client'
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { joinEvent } from "@/lib/actions/eventActions";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils/errorHelpers";

const InputCodeEvent = () => {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        setError(null); // Clear error when input changes
    }

    const handleSubmit = async () => {
        if (!code.trim()) {
            setError("Por favor ingresa un código");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await joinEvent(code);
            router.refresh(); // Forzar refresh para que SSR traiga el nuevo evento
            setCode(""); // Limpiar input tras éxito
        } catch (err) {
            console.error("Error joining event:", err);
            setError(getErrorMessage(err, "Ocurrió un error al unirse al evento"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-row items-center mt-4 gap-2">
                <Input 
                    type="text" 
                    className="max-w-sm" 
                    value={code} 
                    onChange={handleChange}
                    placeholder="Ingresa código de invitación" 
                    disabled={loading}
                />
                <Button 
                    className="w-28" 
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Cargando..." : "Unirme"}
                </Button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
}

export default InputCodeEvent;