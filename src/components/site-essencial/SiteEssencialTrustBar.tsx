import React from "react";
import { Eye, Smartphone, MessageCircle, CheckCircle } from "lucide-react";
import { SITE_ESSENCIAL_TRUST_ITEMS } from "../../data/siteData";

const iconMap = {
  Eye,
  Smartphone,
  MessageCircle,
  CheckCircle,
};

export const SiteEssencialTrustBar: React.FC = () => {
  return (
    <section className="border-y border-white/[0.07] bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {SITE_ESSENCIAL_TRUST_ITEMS.map((item) => {
          const Icon = iconMap[item.iconName as keyof typeof iconMap] || Eye;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-[15px] leading-snug text-white/85">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
