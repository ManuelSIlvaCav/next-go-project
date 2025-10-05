'use client'

import MainServiceSearchComponent from '@/components/main-service-search-component/MainSearch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Image from 'next/image'
import Link from 'next/link'

// Services data
const servicesCategories = [
  {
    id: 'dog-walking',
    title: 'Dog Walking',
    href: '/services/dog-walking',
    image: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: 'vet-appointment',
    title: 'Pet Vet Appointment',
    href: '/services/vet-appointment',
    image: 'https://picsum.photos/200/300?random=2',
  },
  {
    id: 'pet-exam',
    title: 'Pet Exam Appointment',
    href: '/services/pet-exam',
    image: 'https://picsum.photos/200/300?random=3',
  },
  {
    id: 'pet-grooming',
    title: 'Pet Grooming',
    href: '/services/pet-grooming',
    image: 'https://picsum.photos/200/300?random=4',
  },
  {
    id: 'pet-hotels',
    title: 'Pet Hotels',
    href: '/services/pet-hotels',
    image: 'https://picsum.photos/200/300?random=5',
  },
  {
    id: 'pet-training',
    title: 'Pet Training',
    href: '/services/pet-training',
    image: 'https://picsum.photos/200/300?random=6',
  },
  {
    id: 'pet-sitting',
    title: 'Pet Sitting',
    href: '/services/pet-sitting',
    image: 'https://picsum.photos/200/300?random=7',
  },
]

// Marketplace products data
const marketplaceCategories = [
  {
    id: 'all-for-dogs',
    title: 'All for Dogs',
    href: '/marketplace/dogs',
    image: 'https://picsum.photos/200/300?random=11',
  },
  {
    id: 'all-for-cats',
    title: 'All for Cats',
    href: '/marketplace/cats',
    image: 'https://picsum.photos/200/300?random=12',
  },
  {
    id: 'pet-food',
    title: 'Pet Food',
    href: '/marketplace/food',
    image: 'https://picsum.photos/200/300?random=13',
  },
  {
    id: 'pet-pharmacy',
    title: 'Pet Pharmacy',
    href: '/marketplace/pharmacy',
    image: 'https://picsum.photos/200/300?random=14',
  },
  {
    id: 'toys-accessories',
    title: 'Toys & Accessories',
    href: '/marketplace/toys',
    image: 'https://picsum.photos/200/300?random=15',
  },
  {
    id: 'pet-beds',
    title: 'Pet Beds & Furniture',
    href: '/marketplace/beds',
    image: 'https://picsum.photos/200/300?random=16',
  },
  {
    id: 'pet-care',
    title: 'Pet Care Products',
    href: '/marketplace/care',
    image: 'https://picsum.photos/200/300?random=17',
  },
]

interface CategoryCardProps {
  category: {
    id: string
    title: string
    href: string
    image: string
  }
}

interface CategoryCarouselProps {
  title: string
  categories: typeof servicesCategories
  showNow?: boolean
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.href} className="group block">
      <Card className="w-32 h-32 sm:w-40 sm:h-40 overflow-hidden hover:shadow-lg transition-all duration-200 group-hover:scale-105 dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-0 h-full relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 128px, 160px"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-20">
            <h3 className="text-white text-xs sm:text-sm font-semibold text-center leading-tight">
              {category.title}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function CategoryCarousel({ title, categories, showNow = false }: CategoryCarouselProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {showNow && (
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
          >
            Shop now
          </Button>
        )}
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-3 sm:space-x-4 p-1">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <MainServiceSearchComponent className="mt-[4rem]" />
        {/* Services Section */}
        <CategoryCarousel
          title="Professional Pet Services"
          categories={servicesCategories}
          showNow
        />

        {/* Marketplace Section */}
        <CategoryCarousel
          title="Everything you need to start the year right"
          categories={marketplaceCategories}
          showNow
        />

        {/* Additional Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mt-8 sm:mt-12">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🐕</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">
                Professional Care
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Connect with certified pet professionals in your area
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🛍️</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">
                Quality Products
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Premium pet products from trusted brands and local suppliers
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🚚</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">
                Fast Delivery
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Same-day delivery available for most products and services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
