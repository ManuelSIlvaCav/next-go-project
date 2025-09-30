// Shared navigation data for main navigation menu
export const navigationData = {
  shop: {
    title: 'Shop',
    href: '/products',
    hasDropdown: false,
  },
  health: {
    title: 'Health',
    href: '/health',
    hasDropdown: true,
    categories: [
      {
        id: '1',
        title: 'Lorem Medicina',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        href: '/health/medicina',
      },
      {
        id: '2',
        title: 'Ipsum Prevención',
        description: 'Sed do eiusmod tempor incididunt ut labore',
        href: '/health/prevencion',
      },
      {
        id: '3',
        title: 'Dolor Emergencias',
        description: 'Ut enim ad minim veniam, quis nostrud',
        href: '/health/emergencias',
      },
      {
        id: '4',
        title: 'Amet Bienestar',
        description: 'Excepteur sint occaecat cupidatat non proident',
        href: '/health/bienestar',
      },
    ],
  },
  services: {
    title: 'Services',
    href: '/services',
    hasDropdown: true,
    categories: [
      {
        id: '1',
        title: 'Consectetur Cuidado',
        description: 'Lorem ipsum dolor sit amet, consectetur',
        href: '/services',
      },
      {
        id: '2',
        title: 'Adipiscing Entrenamiento',
        description: 'Sed do eiusmod tempor incididunt',
        href: '/services',
      },
      {
        id: '3',
        title: 'Elit Hospedaje',
        description: 'Ut enim ad minim veniam, quis',
        href: '/services',
      },
      {
        id: '4',
        title: 'Tempor Transporte',
        description: 'Excepteur sint occaecat cupidatat',
        href: '/services',
      },
    ],
  },
} as const