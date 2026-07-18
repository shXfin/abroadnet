import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type Translations } from "./translations";

type LangContextValue = {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("abroadnet-lang");
    return saved === "bn" ? "bn" : "en";
  });

  useEffect(() => {
    localStorage.setItem("abroadnet-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
