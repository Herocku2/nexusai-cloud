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
      title: "Mi Red Binaria",
      url: "#",
      icon: Network,
      isActive: true,
      items: [
        {
          title: "Árbol Binario",
          url: "/binary-tree",
          circleColor: "bg-primary",
        },
        {
          title: "Mi Red",
          url: "/my-network",
          circleColor: "bg-green-600",
        },
        {
          title: "Patrocinados",
          url: "/sponsored",
          circleColor: "bg-blue-500",
        },
        {
          title: "Genealogía",
          url: "/genealogy",
          circleColor: "bg-purple-600",
        },
      ],
    },
    // ===== COMISIONES =====
    {
      title: "Comisiones",
      url: "#",
      icon: TrendingUp,
      isActive: true,
      items: [
        {
          title: "Resumen de Ganancias",
          url: "/commissions/earnings",
          circleColor: "bg-green-600",
        },
        {
          title: "Historial",
          url: "/commissions/history",
          circleColor: "bg-blue-500",
        },
        {
          title: "Bono Inicio Rápido",
          url: "/commissions/fast-start",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Bono Binario",
          url: "/commissions/binary",
          circleColor: "bg-primary",
        },
        {
          title: "Bono Igualación",
          url: "/commissions/matching",
          circleColor: "bg-purple-600",
        },
        {
          title: "Reportes",
          url: "/commissions/reports",
          circleColor: "bg-cyan-500",
        },
      ],
    },
    // ===== WALLET / FINANZAS =====
    {
      title: "Billetera",
      url: "#",
      icon: Wallet,
      isActive: true,
      items: [
        {
          title: "Balance",
          url: "/wallet/balance",
          circleColor: "bg-green-600",
        },
        {
          title: "Depositar USDT",
          url: "/wallet/deposit",
          circleColor: "bg-blue-500",
        },
        {
          title: "Retirar Fondos",
          url: "/wallet/withdraw",
          circleColor: "bg-red-600",
        },
        {
          title: "Transacciones",
          url: "/wallet/transactions",
          circleColor: "bg-purple-600",
        },
        {
          title: "Membresía",
          url: "/wallet/membership",
          circleColor: "bg-yellow-500",
        },
      ],
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
      url: "#",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: "Mis Cursos",
          url: "/academy/courses",
          circleColor: "bg-primary",
        },
        {
          title: "Categorías",
          url: "/academy/categories",
          circleColor: "bg-blue-500",
        },
        {
          title: "Mi Progreso",
          url: "/academy/progress",
          circleColor: "bg-green-600",
        },
        {
          title: "Certificados",
          url: "/academy/certificates",
          circleColor: "bg-yellow-500",
        },
        {
          title: "Clases en Vivo",
          url: "/academy/live-classes",
          circleColor: "bg-red-600",
        },
        {
          title: "Recursos",
          url: "/academy/resources",
          circleColor: "bg-purple-600",
        },
      ],
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
      url: "#",
      icon: UsersRound,
      isActive: true,
      items: [
        {
          title: "Información Personal",
          url: "/profile/info",
          circleColor: "bg-primary",
        },
        {
          title: "Seguridad",
          url: "/profile/security",
          circleColor: "bg-red-600",
        },
        {
          title: "Configuración",
          url: "/profile/settings",
          circleColor: "bg-yellow-500",
        },
      ],
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
