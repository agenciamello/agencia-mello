import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialMobileBar: React.FC = () => {
  return (
    <div
      aria-label="Ação rápida para pedir prévia"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-background/95 p-3 backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="leading-tight">
          <p className="text-xs text-muted-foreground">Site Essencial</p>
          <p className="text-sm font-semibold text-white">
            {SITE_ESSENCIAL_PRICE}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              em até 3x
            </span>
          </p>
        </div>

        <Button
          href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.barraMobile)}
          size="sm"
          className="flex-1 justify-center py-2 text-xs font-medium"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>Quero uma prévia</span>
        </Button>
      </div>
    </div>
  );
};
