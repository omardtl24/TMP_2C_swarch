export const dynamic = "force-dynamic";

import { fetchEvents } from "@/lib/actions/eventActions";
import EventBoardClient from "./EventBoardClient";
import { EventType } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils/errorHelpers";

export default async function EventBoardPage() {
  let events: EventType[] = [];
  let error: string | undefined = undefined;

  try {
    events = await fetchEvents();
  } catch (e) {
    error = getErrorMessage(e, "Error al cargar eventos");
  }

  return <EventBoardClient events={events} error={error} />;
}