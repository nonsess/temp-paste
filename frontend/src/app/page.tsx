"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import TTLSelector from "@/components/ui/TTLSelector";
import TextInput from "@/components/ui/TextInput";
import { pasteService } from "@/services/paste.service";

export default function HomePage() {
  const router = useRouter();
  const [ttl, setTtl] = useState(60);
  const [text, setText] = useState("");
  const [pasteIdInput, setPasteIdInput] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleClear = () => {
    setText("");
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleCreate = async () => {
    if (!text.trim()) {
      alert("Введите текст заметки");
      return;
    }

    try {
      const paste = await pasteService.createPaste({ text, ttl });
      router.push(`/pastes/${paste.id}`);
    } catch (error) {
      console.error("Ошибка создания заметки:", error);
      alert(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  };

  const handlePasteIdChange = (value: string) => {
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setPasteIdInput(filteredValue);
    setSearchError("");
  };

  const handleSearchPaste = async () => {
    const pasteId = pasteIdInput.trim();

    if (pasteId.length !== 6) {
      setSearchError("Код должен содержать 6 символов");
      return;
    }

    setIsSearchLoading(true);
    setSearchError("");

    try {
      await pasteService.getPaste(pasteId);
      router.push(`/pastes/${pasteId}`);
    } catch (error) {
      setSearchError("Заметка не найдена");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && pasteIdInput.length === 6) {
      handleSearchPaste();
    }
  };

  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-linear-to-r from-temp-primary via-temp-secondary to-temp-primary bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              Временные заметки
            </span>
          </h2>
          <p className="text-lg text-temp-text/70 max-w-2xl mx-auto">
            Создайте заметку, установите время жизни от 1 минуты до 24 часов, и
            она автоматически исчезнет. Без регистрации, анонимно, безопасно.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="relative">
                <div className="flex items-center gap-1">
                  <div className="relative flex-1">
                    <TextInput
                      ref={searchInputRef}
                      value={pasteIdInput}
                      onChange={handlePasteIdChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Открыть по коду"
                      maxLength={6}
                      className="text-left font-mono tracking-wider"
                    />
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleSearchPaste}
                    isLoading={isSearchLoading}
                    disabled={pasteIdInput.length !== 6 || isSearchLoading}
                    size="md"
                    className="h-12"
                  >
                    Открыть
                  </Button>
                </div>
              </div>

              {searchError && (
                <div className="text-center">
                  <p className="text-red-400 text-xs flex items-center justify-center gap-1">
                    <svg
                      className="w-3 h-3"
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
                    {searchError}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-temp-dark/40 backdrop-blur-sm rounded-xl border border-temp-primary/15 p-6 md:p-7">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-1 space-y-5">
                <div>
                  <TTLSelector value={ttl} onChange={setTtl} />
                </div>
              </div>

              <div className="md:col-span-2">
                <TextArea
                  ref={textAreaRef}
                  label="Содержимое заметки"
                  placeholder="Вставьте текст, код, пароль, конфигурацию..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  maxChar={7000}
                  currentLength={text.length}
                  className="font-mono text-sm"
                />

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-5 pt-5 border-t border-temp-primary/10">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleClear}
                      disabled={text.length === 0}
                      size="sm"
                    >
                      Очистить
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreate}
                      disabled={text.length === 0}
                      size="sm"
                    >
                      Создать
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
