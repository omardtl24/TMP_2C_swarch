import { ExpenseType } from "@/lib/types";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/contexts/SessionContext";

interface ExpenseProps {
  expense: ExpenseType;
  handleClickExpense: (idExpense: string) => void;
  onEdit: (idExpense: string) => void;
  onDelete: (idExpense: string) => void;
}

const Expense = ({ expense, handleClickExpense, onEdit, onDelete }: ExpenseProps) => {

    const { session } = useSession();
    const isCreator = String(session?.id) === String(expense.creator_id);
  return (
    <div
      onClick={() => handleClickExpense(expense.id)}
      className="border-2 border-[#E9DDFF] rounded-xl p-3 hover:bg-primary-80 hover:cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#3A0092] font-bold">
            ${new Intl.NumberFormat("es-CO").format(expense.total)}
          </p>
          <p className="text-[#3A0092]">{expense.concept}</p>
          <p className="text-xs text-gray-500">
            Pagado por <span className="font-medium">{expense.payer_name}</span>
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-sm font-semibold text-[#3A0092]">
            {expense.type}
          </span>
          {isCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hover:bg-gray-200 rounded-full p-1"
                  onClick={(e) => { 
                    e.stopPropagation()
                  }}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  onEdit(expense.id)
                  e.stopPropagation();}}>
                  <Pencil className="w-4 h-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(expense.id);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar gasto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

        </div>
      </div>
    </div>
  );
};

export default Expense;
