"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { PasteResponse } from "@/services/paste.service";
import QRCode from "react-qr-code";
import { formatDetailed } from "@/libs/time";

export default function PastePage() {
  const [copyTextStatus, setCopyTextStatus] = useState<"idle" | "copied">(
    "idle",
  );
  const [copyLinkStatus, setCopyLinkStatus] = useState<"idle" | "copied">(
    "idle",
  );

  const params = useParams();
  const router = useRouter();
  const pasteId = params.paste_id as string;

  const [paste, setPaste] = useState<PasteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fullPasteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/pastes/${pasteId}`
      : `/pastes/${pasteId}`;

  useEffect(() => {
    if (!pasteId || !paste) return;

    const getPollingInterval = (ttlMinutes: number): number => {
      if (ttlMinutes <= 5) return 10_000;
      if (ttlMinutes <= 30) return 20_000;
      if (ttlMinutes <= 120) return 45_000;
      return 120_000;
    };

    const intervalMs = getPollingInterval(paste.ttl);
    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`/api/v1/pastes/${pasteId}`);
          if (!response.ok && response.status === 404) {
            if (intervalId) clearInterval(intervalId);
            setPaste(null);
            setError("Она была автоматически удалена");
          }
        } catch (err) {
          console.warn("Polling error (ignored):", err);
        }
      }, intervalMs);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pasteId]);

  const handleCopyContent = () => {
    if (!paste) return;

    navigator.clipboard
      .writeText(paste.text)
      .then(() => {
        setCopyTextStatus("copied");
        setTimeout(() => setCopyTextStatus("idle"), 2000);
      })
      .catch((err) => {
        console.error("Не удалось скопировать:", err);
      });
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(fullPasteUrl)
      .then(() => {
        setCopyLinkStatus("copied");
        setTimeout(() => setCopyLinkStatus("idle"), 2000);
      })
      .catch((err) => {
        console.error("Не удалось скопировать ссылку:", err);
      });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-temp-dark/50 backdrop-blur-sm rounded-2xl border border-temp-primary/20 py-12 px-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-temp-primary/10 mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-temp-primary"></div>
              </div>
              <p className="text-temp-text/80">Загрузка заметки...</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error || !paste) {
    return (
      <main className="min-h-screen py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-temp-dark/50 backdrop-blur-sm rounded-2xl border border-temp-primary/20 py-12 px-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-temp-primary/10 mb-5">
                <svg
                  className="w-6 h-6 text-temp-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-temp-text mb-3">
                Заметка не найдена
              </h2>
              <p className="text-temp-text/80 mb-6 max-w-md mx-auto">
                {error ||
                  "Она могла быть удалена автоматически или ее не существовало."}
              </p>
              <Button variant="primary" onClick={() => router.push("/")}>
                Создать новую заметку
              </Button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:gap-8 gap-6  mx-auto">
          <div className="shrink-0 flex justify-center lg:block">
            <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col items-center">
              <QRCode
                value={fullPasteUrl}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#0f1419"
                level="L"
              />
              <div className="bg-temp-dark py-0.5 mt-3 text-center rounded-lg shadow-lg w-full">
                <code className="text-white font-mono text-lg font-bold tracking-wider">
                  {pasteId}
                </code>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-temp-dark/50 backdrop-blur-sm rounded-2xl border border-temp-primary/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-temp-primary/10 bg-temp-dark/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-temp-secondary">
                    Содержимое заметки
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyContent}
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    }
                  >
                    {copyTextStatus === "copied"
                      ? "Текст скопирован"
                      : "Копировать текст"}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyLink}
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    }
                  >
                    {copyLinkStatus === "copied"
                      ? "Ссылка скопирована"
                      : "Копировать ссылку"}
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="relative">
                  <pre className="text-temp-text whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto">
                    {paste.text}
                  </pre>

                  <div className="absolute bottom-4 right-4 pointer-events-none">
                    <span className="text-temp-primary/10 text-xl font-bold">
                      TempPaste
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-temp-primary/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
                    <div className="text-temp-secondary">
                      Длина:{" "}
                      <span className="text-temp-primary">
                        {paste.text.length}
                      </span>
                    </div>
                    <div className="text-temp-secondary">
                      Время жизни:{" "}
                      <span className="text-temp-primary">
                        {formatDetailed(paste.ttl)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            }
          >
            Вернуться назад
          </Button>
        </div>
      </Container>
    </main>
  );
}
