'use server'
//import { ENDPOINTS } from "../endpoints";
import { callApiWithAuth } from "@/lib/api/callApiWithAuth";
import { EventDetailType, EventType, ParticipantType, CreateEventData } from "../types";

// Obtiene todos los eventos del usuario
export async function fetchEvents(): Promise<EventType[]> {
  return await callApiWithAuth<EventType[]>({
    path: "/api/events/me",
    method: "GET",
    headers: { 'Cache-Control': 'no-store' },
  });
}

// Obtiene el detalle de un evento
export async function fetchEventDetail(id: string): Promise<EventDetailType> {
  return await callApiWithAuth<EventDetailType>({
    path: `/api/events/${id}`,
    method: "GET",
    headers: { 'Cache-Control': 'no-store' },
  });
}

// Crea un nuevo evento
export async function createEvent(eventData: CreateEventData): Promise<EventType> {
  return await callApiWithAuth<EventType>({
    path: "/events",
    method: "POST",
    body: eventData,
    headers: { 'Cache-Control': 'no-store' },
  });
}

// Unirse a un evento usando código de invitación
export async function joinEvent(invitationCode: string): Promise<string> {
  const data = await callApiWithAuth<{ id: string }>({
    path: "/events/join",
    method: "POST",
    body: { invitationCode },
    headers: { 'Cache-Control': 'no-store' },
  });
  return data.id;
}

// Cambia el estado de invitación de un evento
export async function changeInvitationState(enabled: boolean, eventId: string): Promise<{ enabled: boolean; code?: string }> {
  const response = await callApiWithAuth<{ enabled: boolean, code?: string }>({
    path: `/api/events/${eventId}/invite?enabled=${enabled}`,
    method: "PATCH",
    headers: { 'Cache-Control': 'no-store' },
  });
  return {
    enabled: response.enabled,
    code: response.code,
  };
}

// Elimina un evento
export async function deleteEvent(eventId: string): Promise<void> {
  await callApiWithAuth({
    path: `/events/${eventId}`,
    method: "DELETE",
    headers: { 'Cache-Control': 'no-store' },
  });
}

// Obtiene los participantes de un evento
export async function participantsEvent(id: string): Promise<ParticipantType[]> {
  const data = await callApiWithAuth<ParticipantType[]>({
    path: `/api/events/${id}/participants`,
    method: "GET",
    headers: { 'Cache-Control': 'no-store' },
  });
  return data;
}
