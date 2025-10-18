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
      url: "#",
      icon: Award,
      isActive: true,
      items: [
        {
          title: "Rango Actual",
          url: "/rank/current",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Progreso",
          url: "/rank/progress",
          circleColor: "bg-primary",
        },
        {
          title: "Requisitos",
          url: "/rank/requirements",
          circleColor: "bg-green-600",
        },
        {
          title: "Historial de Rangos",
          url: "/rank/history",
          circleColor: "bg-purple-600",
        },
      ],
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
