'use client';

import {
  House,
  Network,
  TrendingUp,
  Wallet,
  DollarSign,
  Award,
  GraduationCap,
  MessageCircleMore,
  Mail,
  UsersRound,
  Settings,
} from "lucide-react";
import { useTranslations } from 'next-intl';

export function useSidebarData() {
  const t = useTranslations('nav');
  
  return {
    navMain: [
      // ===== DASHBOARDS =====
      {
        title: t('dashboard'),
        url: "/dashboard",
        icon: House,
      },
      {
        label: "Red & Negocios",
      },
      // ===== BINARIO / MLM =====
      {
        title: t('team'),
        url: "/dashboard/team",
        icon: Network,
      },
      // ===== COMISIONES =====
      {
        title: t('commissions'),
        url: "/dashboard/commissions",
        icon: TrendingUp,
      },
      // ===== WALLET / FINANZAS =====
      {
        title: t('wallet'),
        url: "/dashboard/wallet",
        icon: Wallet,
      },
      // ===== PAGOS =====
      {
        title: t('payments'),
        url: "/dashboard/payments",
        icon: DollarSign,
      },
      // ===== RANGOS =====
      {
        title: t('ranks'),
        url: "/dashboard/ranks",
        icon: Award,
      },
      {
        label: "Academia & Aprendizaje",
      },
      // ===== ACADEMIA LMS =====
      {
        title: t('academy'),
        url: "/dashboard/academy",
        icon: GraduationCap,
      },
      {
        label: "Comunicación",
      },
      // ===== MENSAJERÍA =====
      {
        title: t('messages'),
        url: "/messages",
        icon: MessageCircleMore,
      },
      {
        title: t('notifications'),
        url: "/notifications",
        icon: Mail,
      },
      {
        label: "Configuración",
      },
      // ===== PERFIL =====
      {
        title: t('profile'),
        url: "/dashboard/profile",
        icon: UsersRound,
      },
      // ===== SOPORTE =====
      {
        title: "Ayuda & Soporte",
        url: "#",
        icon: Settings,
        isActive: true,
        items: [
          {
            title: "Centro de Ayuda",
            url: "/dashboard/support",
            circleColor: "bg-primary",
          },
          {
            title: "FAQs",
            url: "/dashboard/support",
            circleColor: "bg-blue-500",
          },
          {
            title: "Contactar Soporte",
            url: "/dashboard/support",
            circleColor: "bg-green-600",
          },
        ],
      },
    ],
  };
}
