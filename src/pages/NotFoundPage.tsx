import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Página não encontrada | Agência Mello";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-32 px-5 sm:px-6">
        <div className="mx-auto max-w-md text-center">
          <span className="text-6xl sm:text-7xl font-bold text-accent">404</span>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
            Página não encontrada
          </h1>
          <p className="mt-3 text-muted-foreground text-[15px]">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para o início</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
