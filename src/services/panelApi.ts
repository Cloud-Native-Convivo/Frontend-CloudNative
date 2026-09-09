import { getStoredIdToken } from "../lib/authStorage";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) || "http://localhost:3000/api/v1";

export interface BackendPanelKpi {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  badge_label: string;
  badge_variant: "green" | "yellow" | "blue";
  spark?: number[];
  spark_color?: string;
}

export interface BackendPanelNotice {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

export interface BackendPanelVisit {
  id: number;
  nombre: string;
  fecha: string;
  estado: "Confirmada" | "Pendiente QR";
}

export interface BackendPanelActivity {
  id: number;
  icon: string;
  description: string;
  timestamp: string;
  color: string;
}

export interface BackendPanelResponse {
  unread_count: number;
  kpis: BackendPanelKpi[];
  notices: BackendPanelNotice[];
  visits: BackendPanelVisit[];
  activity: BackendPanelActivity[];
}

// Contrato asumido de TD-26 (BFF sin desplegar aun) -- ajustar los tipos de
// arriba si el endpoint real termina con otra forma.
export async function obtenerPanel(idToken?: string): Promise<BackendPanelResponse> {
  const token = idToken ?? getStoredIdToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/panel`, { headers });
  if (!response.ok) {
    throw new Error(`Error al obtener panel: HTTP ${response.status}`);
  }
  return response.json();
}
