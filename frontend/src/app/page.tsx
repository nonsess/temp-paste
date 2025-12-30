"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import TTLSelector from "@/components/ui/TTLSelector";
import { pasteService } from "@/services/paste.service";

export default function HomePage() {
  const router = useRouter();
  const [ttl, setTtl] = useState(60);
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleClear = () => {
    setText("");
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  const handleCreate = async() => {
    if (!text.trim()) {
      alert("Введите текст заметки");
      return;
    }

    const paste = await pasteService.createPaste({ttl, text})

    router.push(`/pastes/${paste.id}`);
  };

  return (
    <main className="py-8">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-temp-primary via-temp-secondary to-temp-primary bg-clip-text text-transparent bg-size-[200%] animate-gradient">
              Временные заметки
            </span>
          </h2>
          <p className="text-xl text-temp-text/70 max-w-3xl mx-auto">
            Создайте заметку, установите время жизни от 1 минуты до 24 часов, и
            она автоматически исчезнет. Без регистрации, анонимно, безопасно.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-temp-dark/50 backdrop-blur-sm rounded-2xl border border-temp-primary/20 p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-temp-text mb-4">
                  Настройки заметки
                </h3>

                <TTLSelector
                  value={ttl}
                  onChange={(minutes) => setTtl(minutes)}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <TextArea
                ref={textAreaRef}
                label="Содержимое заметки"
                placeholder="Вставьте ваш текст, код, конфигурацию, пароль или любое содержимое, которое должно исчезнуть через заданное время..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                maxChar={7000}
                currentLength={text.length}
                className="font-mono text-sm"
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-temp-primary/10">
                <div className="text-sm text-temp-secondary/70">
                  {text.length > 0 && (
                    <>
                      Символов:{" "}
                      <span className="text-temp-primary">{text.length}</span>
                      {text.length >= 7000 && (
                        <span className="ml-2 text-red-400">⚠ Лимит!</span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleClear}
                    disabled={text.length === 0}
                  >
                    Очистить
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCreate}
                    disabled={text.length === 0}
                  >
                    Создать заметку
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
