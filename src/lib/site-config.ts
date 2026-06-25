export const siteConfig = {
  company: {
    name: "Nexa",
    suffix: "Core",
    tagline: "Líderes en innovación tecnológica",
    foundedYear: 2024,
  },

  urls: {
    app: "http://18.220.76.161",
    login: "http://18.220.76.161/login",
    appDownload:
      "https://drive.google.com/drive/folders/1WF5a2QxjB4F2zL9Kg7_lzV-XP02DOEBG?usp=sharing",
  },

  hero: {
    title: "Innovación Tecnológica a tu Alcance",
    titleHighlight: "Tecnológica a tu",
    subtitle:
      "Desarrollamos soluciones de software personalizadas que transforman ideas en realidad digital.",
    primaryCta: "Comenzar Proyecto",
    secondaryCta: "Ver Productos",
    backgroundImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
  },

  about: {
    title: "Quiénes Somos",
    subtitle: "Líderes en innovación tecnológica",
    missionTitle: "Nuestra Misión",
    mission:
      "Somos una empresa de desarrollo de software comprometida con la excelencia y la innovación. Ayudamos a instituciones educativas y organizaciones a digitalizar sus procesos, optimizar recursos y mejorar la experiencia de sus usuarios desde 2024.",
    stats: [
      { value: "50+", label: "Proyectos Completados" },
      { value: "25+", label: "Clientes Satisfechos" },
      { value: "2", label: "Años de Experiencia" },
    ],
    valuesTitle: "Nuestros Valores",
    values: [
      {
        title: "Innovación",
        description: "Utilizamos las últimas tecnologías y metodologías.",
        icon: "lightbulb" as const,
      },
      {
        title: "Calidad",
        description: "Entregamos productos robustos y bien documentados.",
        icon: "shield" as const,
      },
      {
        title: "Colaboración",
        description: "Trabajamos de la mano con nuestros clientes.",
        icon: "users" as const,
      },
    ],
  },

  products: {
    title: "Productos",
    subtitle: "Soluciones diseñadas para transformar tu operación",
    flagship: {
      name: "GestorLab",
      description:
        "Plataforma integral para la gestión de laboratorios de cómputo: inventario, reservas, actividades, incidencias y control de personal en un solo lugar.",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
      features: [
        {
          title: "Laboratorios y Equipos",
          description:
            "Inventario en tiempo real de computadoras, servidores y hardware.",
        },
        {
          title: "Reservas Inteligentes",
          description:
            "Programación sin conflictos para laboratorios y espacios de trabajo.",
        },
        {
          title: "Seguimiento de Actividades",
          description:
            "Control de prácticas, materias y software requerido por actividad.",
        },
        {
          title: "Reporte de Incidencias",
          description:
            "Notificación inmediata de fallas de red, software o hardware.",
        },
        {
          title: "App Móvil",
          description:
            "Acceso desde dispositivos móviles para auxiliares y operadores.",
        },
      ],
    },
  },

  services: {
    title: "Servicios",
    subtitle: "Acompañamos a tu organización en cada etapa del desarrollo",
    items: [
      {
        title: "Desarrollo a Medida",
        description:
          "Creamos aplicaciones web y móviles adaptadas a las necesidades específicas de tu institución.",
        icon: "code" as const,
      },
      {
        title: "Consultoría Tecnológica",
        description:
          "Asesoramos en arquitectura, digitalización de procesos y selección de stack tecnológico.",
        icon: "chart" as const,
      },
      {
        title: "Soporte y Mantenimiento",
        description:
          "Garantizamos continuidad operativa con soporte técnico y actualizaciones periódicas.",
        icon: "support" as const,
      },
      {
        title: "Integración de Sistemas",
        description:
          "Conectamos plataformas existentes con nuevas soluciones para un ecosistema unificado.",
        icon: "network" as const,
      },
    ],
  },

  project: {
    title: "¿Listo para digitalizar tu laboratorio?",
    subtitle:
      "Accede a NEXACORE y comienza a gestionar equipos, reservas e incidencias con precisión absoluta.",
    cta: "Comenzar Proyecto",
  },

  contact: {
    title: "Información de Contacto",
    subtitle: "Estamos aquí para ayudarte. Escríbenos o visítanos.",
    details: [
      {
        label: "Dirección",
        value: "Av. Principal 123, Cotoca, Santa Cruz, Bolivia",
        icon: "location" as const,
      },
      {
        label: "Teléfono",
        value: "+591 7738-9330",
        icon: "phone" as const,
      },
      {
        label: "Email",
        value: "edybanera@gmail.com",
        icon: "email" as const,
      },
      {
        label: "Horarios",
        value: "Lunes a Viernes: 8:00 - 18:00",
        icon: "clock" as const,
      },
    ],
    widget: {
      title: "Contáctanos directamente:",
      whatsapp: [
        {
          label: "Edberto Ybanera: +591 77389330",
          href: "https://wa.me/59177389330",
          primary: true,
        },
        {
          label: "Juan Noe Jarpa: +591 71064272",
          href: "https://wa.me/59171064272",
          primary: false,
        },
      ],
      emails: ["edybanera@gmail.com", "juan.noe.jarpa.18@gmail.com"],
    },
  },

  chat: {
    title: "",
    whatsapp: [],
    emails: [],
  },

  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Quiénes Somos", href: "#quienes-somos" },
    { label: "Productos", href: "#productos" },
    { label: "Servicios", href: "#servicios" },
    { label: "Proyecto", href: "#proyecto" },
    { label: "Contacto", href: "#contacto" },
  ],

  footer: {
    copyright: "Nexacore. Todos los derechos reservados.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
