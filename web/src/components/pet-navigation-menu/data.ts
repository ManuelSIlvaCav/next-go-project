import { Category, MainCategory } from './types'

// Navigation structure based on the PetVet example
export const NAVIGATION_CATEGORIES: Category[] = [
  {
    id: 'ofertas',
    name: 'OFERTAS',
    href: '/ofertas',
    subcategories: [
      { id: 'ofertas-especiales', name: 'Ofertas Especiales', href: '/ofertas/especiales' },
      { id: 'descuentos', name: 'Descuentos', href: '/ofertas/descuentos' },
      { id: 'packs', name: 'Packs', href: '/ofertas/packs' },
    ],
  },
  {
    id: 'packs',
    name: 'PACKS',
    href: '/packs',
    subcategories: [
      { id: 'pack-cachorros', name: 'Pack Cachorros', href: '/packs/cachorros' },
      { id: 'pack-adultos', name: 'Pack Adultos', href: '/packs/adultos' },
      { id: 'pack-senior', name: 'Pack Senior', href: '/packs/senior' },
    ],
  },
  {
    id: 'perros',
    name: 'Perros',
    href: '/products/perros',
    subcategories: [
      { id: 'alimentos', name: 'Alimentos', href: '/products/perros/alimentos' },
      { id: 'secos', name: 'Secos', href: '/products/perros/secos' },
      { id: 'humedos', name: 'Húmedos', href: '/products/perros/humedos' },
      { id: 'snacks', name: 'Snacks', href: '/products/perros/snacks' },
      { id: 'medicados', name: 'Medicados', href: '/products/perros/medicados' },
      { id: 'light', name: 'Light', href: '/products/perros/light' },
      { id: 'cachorros', name: 'Cachorros', href: '/products/perros/cachorros' },
      { id: 'senior', name: 'Senior', href: '/products/perros/senior' },
      {
        id: 'sustituto-lacteo',
        name: 'Sustituto Lácteo',
        href: '/products/perros/sustituto-lacteo',
      },
    ],
  },
  {
    id: 'gatos',
    name: 'Gatos',
    href: '/products/gatos',
    subcategories: [
      { id: 'alimentos', name: 'Alimentos', href: '/products/gatos/alimentos' },
      { id: 'secos', name: 'Secos', href: '/products/gatos/secos' },
      { id: 'humedos', name: 'Húmedos', href: '/products/gatos/humedos' },
      { id: 'snacks', name: 'Snacks', href: '/products/gatos/snacks' },
      { id: 'medicados', name: 'Medicados', href: '/products/gatos/medicados' },
      { id: 'light', name: 'Light', href: '/products/gatos/light' },
      { id: 'gatitos', name: 'Gatitos', href: '/products/gatos/gatitos' },
      { id: 'senior', name: 'Senior', href: '/products/gatos/senior' },
      { id: 'arena', name: 'Arena Sanitaria', href: '/products/gatos/arena' },
    ],
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    href: '/farmacia',
    subcategories: [
      {
        id: 'pulgas-garrapatas',
        name: 'Pulgas, Garrapatas y Gusanos',
        href: '/farmacia/pulgas-garrapatas',
      },
      { id: 'antibioticos', name: 'Antibióticos, Infecciones', href: '/farmacia/antibioticos' },
      { id: 'articular', name: 'Articular', href: '/farmacia/articular' },
      { id: 'cardiaco', name: 'Cardíaco', href: '/farmacia/cardiaco' },
      { id: 'conductuales', name: 'Conductuales', href: '/farmacia/conductuales' },
      { id: 'dermatologicos', name: 'Dermatológicos', href: '/farmacia/dermatologicos' },
      { id: 'dolor-inflamacion', name: 'Dolor, Inflamación', href: '/farmacia/dolor-inflamacion' },
      { id: 'hepatico', name: 'Hepático', href: '/farmacia/hepatico' },
      { id: 'digestivo', name: 'Digestivo', href: '/farmacia/digestivo' },
      { id: 'oculares', name: 'Oculares / Óticos', href: '/farmacia/oculares' },
      { id: 'renal', name: 'Renal y Urinario', href: '/farmacia/renal' },
      { id: 'suplementos', name: 'Suplementos y Vitaminas', href: '/farmacia/suplementos' },
      { id: 'terapias', name: 'Terapias Naturales', href: '/farmacia/terapias' },
    ],
  },
  {
    id: 'marcas',
    name: 'Marcas',
    href: '/marcas',
    subcategories: [
      { id: 'royal-canin', name: 'Royal Canin', href: '/marcas/royal-canin' },
      { id: 'hills', name: 'Hills', href: '/marcas/hills' },
      { id: 'pro-plan', name: 'Pro Plan', href: '/marcas/pro-plan' },
      { id: 'eukanuba', name: 'Eukanuba', href: '/marcas/eukanuba' },
      { id: 'acana', name: 'Acana', href: '/marcas/acana' },
      { id: 'orijen', name: 'Orijen', href: '/marcas/orijen' },
    ],
  },
  {
    id: 'servicios',
    name: 'Servicios',
    href: '/servicios',
    subcategories: [
      { id: 'veterinaria', name: 'Veterinaria', href: '/servicios/veterinaria' },
      { id: 'grooming', name: 'Grooming', href: '/servicios/grooming' },
      { id: 'entrenamiento', name: 'Entrenamiento', href: '/servicios/entrenamiento' },
      { id: 'guarderia', name: 'Guardería', href: '/servicios/guarderia' },
    ],
  },
]

// First level navigation structure
export const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'shopping',
    name: 'Shop',
    icon: '🛍️',
    defaultOpen: true,
    subcategories: NAVIGATION_CATEGORIES, // Our existing pet categories
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    defaultOpen: false,
    subcategories: [
      {
        id: 'veterinary',
        name: 'Veterinary Services',
        href: '/health/veterinary',
        subcategories: [],
      },
      {
        id: 'checkups',
        name: 'Health Checkups',
        href: '/health/checkups',
        subcategories: [],
      },
      {
        id: 'emergency',
        name: 'Emergency Care',
        href: '/health/emergency',
        subcategories: [],
      },
    ],
  },
  {
    id: 'hotels',
    name: 'Hotels',
    icon: '🏨',
    defaultOpen: false,
    subcategories: [
      {
        id: 'pet-boarding',
        name: 'Pet Boarding',
        href: '/hotels/boarding',
        subcategories: [],
      },
      {
        id: 'daycare',
        name: 'Pet Daycare',
        href: '/hotels/daycare',
        subcategories: [],
      },
      {
        id: 'luxury-suites',
        name: 'Luxury Suites',
        href: '/hotels/luxury',
        subcategories: [],
      },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    icon: '🛠️',
    defaultOpen: false,
    subcategories: [
      {
        id: 'grooming',
        name: 'Pet Grooming',
        href: '/services/grooming',
        subcategories: [],
      },
      {
        id: 'training',
        name: 'Pet Training',
        href: '/services/training',
        subcategories: [],
      },
      {
        id: 'walking',
        name: 'Pet Walking',
        href: '/services/walking',
        subcategories: [],
      },
    ],
  },
]
