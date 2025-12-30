const BASE_URL = "http://localhost:8080";

export interface CreatePasteRequest {
  text: string;
  ttl: number;
}

export interface PasteResponse {
  id: string;
  text: string;
  ttl: number;
}

class PasteService {
  async createPaste(data: CreatePasteRequest): Promise<PasteResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/pastes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Не удалось создать заметку");
    }

    return response.json();
  }

  async getPaste(pasteId: string): Promise<PasteResponse> {
    const response = await fetch(`${BASE_URL}/api/v1/pastes/${pasteId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Заметка не найдена");
      }
    }

    return response.json();
  }
}

export const pasteService = new PasteService();