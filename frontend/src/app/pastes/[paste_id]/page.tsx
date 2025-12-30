"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { Paste } from "@/types/paste";

export default function PastePage() {
  const params = useParams();
  const router = useRouter();
  const pasteId = params.paste_id as string;

  const [paste, setPaste] = useState<Paste | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaste = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const fakePaste: Paste = {
          id: pasteId,
          content: `# Пример заметки с кодом

Это демонстрационная заметка с ID: ${pasteId}

## Код на JavaScript:
\`\`\`javascript
function helloWorld() {
  console.log('Привет, TempPaste!');
  
  // Пример кода
  const data = {
    id: '${pasteId}',
    timestamp: new Date().toISOString(),
    content: 'Текст заметки'
  };
  
  return data;
}
\`\`\`

## Конфигурация:
\`\`\`yaml
database:
  host: localhost
  port: 5432
  username: admin
  password: ${"*".repeat(12)}
  
server:
  port: 3000
  ssl: true
\`\`\`

Эта заметка будет автоматически удалена через указанное время.`,
          ttl: 60, // 1 час
        };

        setPaste(fakePaste);
      } catch (err) {
        setError("Не удалось загрузить заметку");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (pasteId) {
      fetchPaste();
    }
  }, [pasteId]);

  const handleCopyContent = () => {
    if (!paste) return;

    navigator.clipboard
      .writeText(paste.content)
      .then(() => {
        alert("Содержимое скопировано в буфер обмена!");
      })
      .catch((err) => {
        console.error("Не удалось скопировать:", err);
      });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Ссылка скопирована в буфер обмена!");
      })
      .catch((err) => {
        console.error("Не удалось скопировать ссылку:", err);
      });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-temp-primary mb-4"></div>
              <p className="text-temp-text/70">Загрузка заметки...</p>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error || !paste) {
    return (
      <main className="min-h-screen py-8">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-temp-text mb-2">
                Заметка не найдена
              </h2>
              <p className="text-temp-text/70 mb-6">
                {error || "Заметка с таким ID не существует или была удалена"}
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-temp-text">
                Просмотр заметки
              </h1>
            </div>
          </div>

          <div className="bg-temp-dark/50 backdrop-blur-sm rounded-2xl border border-temp-primary/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-temp-primary/10 bg-temp-dark/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-temp-secondary">Действия:</span>
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
                  Копировать текст
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
                  Копировать ссылку
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="relative">
                <pre className="text-temp-text whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto">
                  {paste.content}
                </pre>

                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <span className="text-temp-primary/10 text-xl font-bold">
                    TempPaste
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-temp-primary/10">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-temp-secondary">
                    Длина:{" "}
                    <span className="text-temp-primary">
                      {paste.content.length}
                    </span>{" "}
                    символов
                  </div>
                  <div className="text-temp-secondary">
                    Время жизни:{" "}
                    <span className="text-temp-primary">{paste.ttl} минут</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
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
              Создать новую заметку
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
