// Import global styles and fonts
import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { fredoka, latto } from './(main)/internal/dashboard/fonts'


export const metadata: Metadata = {
  title: '404 - Página No Encontrada | Petza',
  description: 'Lo sentimos, la página que buscas no existe. ¡Pero nuestras mascotas están aquí para ayudarte!',
}

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${fredoka.variable} ${latto.variable}`}>
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Animated pets looking for something */}
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 relative">
                {/* Cute searching animation using CSS */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
                
                {/* Dog searching */}
                <div className="absolute top-1/4 left-1/4 text-4xl sm:text-6xl animate-bounce">
                  🐕
                </div>
                
                {/* Cat searching */}
                <div className="absolute top-1/2 right-1/4 text-3xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                  🐱
                </div>
                
                {/* Magnifying glass */}
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-2xl sm:text-4xl animate-ping">
                  🔍
                </div>
                
                {/* Paw prints */}
                <div className="absolute top-1/3 right-1/3 text-lg sm:text-2xl opacity-60 animate-pulse">
                  🐾
                </div>
                <div className="absolute bottom-1/3 left-1/3 text-lg sm:text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>
                  🐾
                </div>
              </div>
            </div>

            {/* 404 Text */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-fredoka font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-pulse">
                404
              </h1>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-fredoka font-bold text-secondary dark:text-primary">
                ¡Oops! Página Perdida
              </h2>
              
              <p className="text-base sm:text-lg font-lato text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Parece que nuestras mascotas no pudieron encontrar esta página. 
                ¡Pero no te preocupes, te ayudamos a encontrar lo que buscas!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white font-fredoka font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🏠 Ir al Inicio
              </Link>
              
              <Link
                href="/products"
                className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-white font-fredoka font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🛍️ Ver Productos
              </Link>
            </div>

            {/* Fun pet facts */}
            <div className="mt-8 p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-lg sm:text-xl font-fredoka font-bold text-secondary dark:text-primary mb-3">
                💡 ¿Sabías que...?
              </h3>
              <p className="text-sm sm:text-base font-lato text-gray-700 dark:text-gray-300">
                Los perros pueden oler hasta 100,000 veces mejor que los humanos, 
                ¡pero aún no pueden encontrar páginas web perdidas! 🐕‍🦺
              </p>
            </div>

            {/* Contact section */}
            <div className="text-center pt-4">
              <p className="text-sm font-lato text-gray-500 dark:text-gray-400">
                ¿Necesitas ayuda? 
                <Link 
                  href="/contact" 
                  className="text-primary hover:text-primary/80 font-medium ml-1 underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
                >
                  Contáctanos
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements for extra cuteness */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 text-2xl opacity-30 animate-float">🎾</div>
          <div className="absolute top-20 right-20 text-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>🦴</div>
          <div className="absolute bottom-20 left-20 text-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}>🐾</div>
          <div className="absolute bottom-10 right-10 text-2xl opacity-30 animate-float" style={{ animationDelay: '6s' }}>🐕‍🦺</div>
        </div>
      </body>
    </html>
  )
}
