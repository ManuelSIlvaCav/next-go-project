'use client'

import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { Fragment, useEffect, useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Media } from '@/cms/components/Media'
import { cn } from '@/lib/utils'
import type { CarrouselBlock as CarrouselBlockProps } from '@/payload-types'

export const CarrouselBlock: React.FC<CarrouselBlockProps> = (props) => {
  const { sliderItems } = props

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalItems, setTotalItems] = useState(sliderItems.length)

  useEffect(() => {
    if (!carouselApi) return

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap())
      setTotalItems(carouselApi.scrollSnapList().length)
    }

    updateCarouselState()

    carouselApi.on('select', updateCarouselState)

    return () => {
      carouselApi.off('select', updateCarouselState) // Clean up on unmount
    }
  }, [carouselApi])

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index)
  }

  return (
    <div className="relative mx-auto mt-5 max-w-full min-h-[30vh]">
      <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
        <CarouselContent>
          {Array.from(sliderItems).map((item, index) => {
            return (
              <CarouselItem key={index} className="h-[70vh] md:h-[50vh] xl:h-[60vh] 2xl:h-[70vh]">
                {item.landscapeImg && typeof item.landscapeImg === 'object' && (
                  <>
                    <Media
                      imgClassName={cn(`-z-10 h-full`, item.portraitImg && 'hidden md:block')}
                      priority
                      resource={item.landscapeImg}
                      htmlElement={Fragment}

                      /* htmlElement={'div'}
                    className="h-[30vh] relative" */
                    />
                    {item.portraitImg && typeof item.portraitImg === 'object' && (
                      <Media
                        imgClassName="-z-10 h-full block md:hidden"
                        priority
                        resource={item.portraitImg}
                        htmlElement={Fragment}

                        /* htmlElement={'div'}
                    className="h-[30vh] relative" */
                      />
                    )}
                  </>
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-20 flex items-center justify-between px-3 pointer-events-none">
        <Button
          onClick={() => scrollToIndex(currentIndex - 1)}
          className="pointer-events-auto rounded-full w-32 h-32 p-0 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronLeft className="size-32" strokeWidth={0.5} />
        </Button>
        <Button
          onClick={() => scrollToIndex(currentIndex + 1)}
          className="pointer-events-auto rounded-full w-32 h-32 p-0 bg-transparent shadow-none hover:bg-transparent"
        >
          <ChevronRight className="size-32" strokeWidth={0.5} />
        </Button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
