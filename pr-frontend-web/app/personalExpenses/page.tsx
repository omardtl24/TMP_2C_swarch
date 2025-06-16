
import { fetchPersonalExpenses } from "@/lib/actions/personalExpensesActions";
import { PersonalExpenseType } from "@/lib/types";
import { notFound } from "next/navigation"
import PersonalExpensesPageClient from "./PersonalExpensesClient";

// Force this page to be dynamically rendered, ensuring it fetches fresh data on every request.
export const dynamic = 'force-dynamic'

export default async function PersonalExpensesPage() {
  let expenses: PersonalExpenseType[] = [];
  try {
    expenses = await fetchPersonalExpenses();
  } catch (e) {
    console.error("Error fetching personal expenses:", e);
    notFound(); // Redirect to 404 if there's an error
  }

  return <PersonalExpensesPageClient expenses={expenses} />;
}
