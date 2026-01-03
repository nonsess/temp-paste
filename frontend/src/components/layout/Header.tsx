"use client";

import Link from "next/link";
import Container from "./Container";

export default function Header() {
  return (
    <header className="sticky backdrop-blur-xl bg-temp-dark/80 border-b border-temp-primary/20 top-0 z-50 py-3">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-temp-primary to-temp-secondary flex items-center justify-center">
                      <span className="text-temp-dark font-black text-lg">
                        TP
                      </span>
                      <div className="absolute -top-1 -right-1 w-3 h-3">
                        <div className="absolute inset-0 rounded-full bg-temp-primary animate-ping opacity-75"></div>
                        <div className="absolute inset-0 rounded-full bg-temp-primary border-2 border-temp-dark"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black bg-linear-to-r from-temp-primary to-temp-secondary bg-clip-text text-transparent">
                      TempPaste
                    </h1>
                    <p className="text-xs text-temp-secondary/70 -mt-0.5 group-hover:text-temp-secondary transition-colors">
                      Сохрани и забудь!
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/nonsess/temp-paste"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-temp-text/80 hover:text-temp-primary rounded-lg hover:bg-temp-dark/50 transition-all duration-200 flex items-center gap-1"
            >
              GitHub
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
