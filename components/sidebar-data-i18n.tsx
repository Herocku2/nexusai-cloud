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
  GitBranch,
} from "lucide-react";
import { useMemo, useState, useEffect } from 'react';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

// Helper para obtener el idioma de las cookies del lado del cliente
function getClientLocale() {
  if (typeof document === 'undefined') return 'es';
  const cookies = document.cookie.split('; ');
  const localeCookie = cookies.find(c => c.startsWith('NEXT_LOCALE='));
  return localeCookie ? localeCookie.split('=')[1] : 'es';
}

export function useSidebarData() {
  const [locale, setLocale] = useState('es');
  
  useEffect(() => {
    setLocale(getClientLocale());
  }, []);
  
  const messages = locale === 'es' ? esMessages : enMessages;
  
  return useMemo(() => ({
    navMain: [
      // ===== DASHBOARDS =====
      {
        title: messages.nav.dashboard,
        url: "/dashboard",
        icon: House,
      },
      {
        label: messages.sidebar.networkBusiness,
      },
      // ===== BINARIO / MLM =====
      {
        title: messages.nav.team,
        url: "/dashboard/team",
        icon: Network,
      },
      {
        title: messages.nav.binaryTree,
        url: "/dashboard/binary-tree",
        icon: GitBranch,
      },
      // ===== COMISIONES =====
      {
        title: messages.nav.commissions,
        url: "/dashboard/commissions",
        icon: TrendingUp,
      },
      // ===== WALLET / FINANZAS =====
      {
        title: messages.nav.wallet,
        url: "/dashboard/wallet",
        icon: Wallet,
      },
      // ===== PAGOS =====
      {
        title: messages.nav.payments,
        url: "/dashboard/payments",
        icon: DollarSign,
      },
      // ===== RANGOS =====
      {
        title: messages.nav.ranks,
        url: "/dashboard/ranks",
        icon: Award,
      },
      {
        label: messages.sidebar.academyLearning,
      },
      // ===== ACADEMIA LMS =====
      {
        title: messages.nav.academy,
        url: "/dashboard/academy",
        icon: GraduationCap,
      },
      {
        label: messages.sidebar.communication,
      },
      // ===== MENSAJERÍA =====
      {
        title: messages.nav.messages,
        url: "/messages",
        icon: MessageCircleMore,
      },
      {
        title: messages.nav.notifications,
        url: "/notifications",
        icon: Mail,
      },
      {
        label: messages.sidebar.settings,
      },
      // ===== PERFIL =====
      {
        title: messages.nav.profile,
        url: "/dashboard/profile",
        icon: UsersRound,
      },
      // ===== SOPORTE =====
      {
        title: messages.sidebar.helpSupport,
        url: "#",
        icon: Settings,
        isActive: true,
        items: [
          {
            title: messages.sidebar.helpCenter,
            url: "/dashboard/support",
            circleColor: "bg-primary",
          },
          {
            title: messages.sidebar.faqs,
            url: "/dashboard/support",
            circleColor: "bg-blue-500",
          },
          {
            title: messages.sidebar.contactSupport,
            url: "/dashboard/support",
            circleColor: "bg-green-600",
          },
        ],
      },
    ],
  }), [locale]);
}
