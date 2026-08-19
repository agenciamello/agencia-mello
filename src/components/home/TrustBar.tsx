import React from "react";
import { Sparkles, Zap, Users, ShieldCheck } from "lucide-react";
import { HOME_TRUST_ITEMS } from "../../data/siteData";

const iconMap = {
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
};

export const TrustBar: React.FC = () => {
  return (
    <section className="border-y border-white/[0.07] bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {HOME_TRUST_ITEMS.map((item) => {
            const Icon = iconMap[item.iconName as keyof typeof iconMap] || Sparkles;
            return (
              <li key={item.label} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-[15px] font-medium leading-snug text-white">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
