import {
  Boxes,
  CalendarDays,
  ChartPie,
  Component,
  House,
  Mail,
  MessageCircleMore,
  Server,
  Settings,
  ShieldCheck,
  StickyNote,
  UsersRound,
  Network,
  GraduationCap,
  Wallet,
  TrendingUp,
  Award,
  Users,
  DollarSign,
} from "lucide-react";

export const data = {
  navMain: [
    // ===== DASHBOARDS =====
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      label: "Red & Negocios",
    },
    // ===== BINARIO / MLM =====
    {
      title: "Mi Equipo",
      url: "/dashboard/team",
      icon: Network,
    },
    // ===== COMISIONES =====
    {
      title: "Comisiones",
      url: "/dashboard/commissions",
      icon: TrendingUp,
    },
    // ===== WALLET / FINANZAS =====
    {
      title: "Billetera",
      url: "/dashboard/wallet",
      icon: Wallet,
    },
    // ===== PAGOS =====
    {
      title: "Pagos & Depósitos",
      url: "/dashboard/payments",
      icon: DollarSign,
    },
    // ===== RANGOS =====
    {
      title: "Mi Rango",
      url: "/dashboard/ranks",
      icon: Award,
    },
    {
      label: "Academia & Aprendizaje",
    },
    // ===== ACADEMIA LMS =====
    {
      title: "Academia",
      url: "/dashboard/academy",
      icon: GraduationCap,
    },
    {
      label: "Comunicación",
    },
    // ===== MENSAJERÍA =====
    {
      title: "Mensajes",
      url: "/messages",
      icon: MessageCircleMore,
    },
    {
      title: "Notificaciones",
      url: "/notifications",
      icon: Mail,
    },
    {
      label: "Configuración",
    },
    // ===== PERFIL =====
    {
      title: "Mi Perfil",
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
          url: "/support/help-center",
          circleColor: "bg-primary",
        },
        {
          title: "FAQs",
          url: "/support/faqs",
          circleColor: "bg-blue-500",
        },
        {
          title: "Contactar Soporte",
          url: "/support/contact",
          circleColor: "bg-green-600",
        },
      ],
    },
  ],
};
