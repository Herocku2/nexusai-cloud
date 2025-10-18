export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-white font-bold text-xl">Nexus AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-300 hover:text-white transition">Inicio</a>
              <a href="#academia" className="text-gray-300 hover:text-white transition">Academia</a>
              <a href="#compensacion" className="text-gray-300 hover:text-white transition">Plan de Compensación</a>
              <a href="#rangos" className="text-gray-300 hover:text-white transition">Rangos</a>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-white hover:text-blue-400 transition">Iniciar Sesión</button>
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">Registrarse</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Domina la <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Aprende las tecnologías más avanzadas en IA y genera ingresos ilimitados con nuestro innovador sistema binario
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105">
              Comenzar Ahora - $89 USD
            </button>
            <button className="px-8 py-4 border-2 border-blue-500 text-white text-lg rounded-lg hover:bg-blue-500/10 transition">
              Ver Demo Gratuita
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">50%</div>
              <div className="text-gray-300">Comisión Binaria</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">$70K</div>
              <div className="text-gray-300">Tope Máximo Mensual</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-900/30 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-300">Carry Over Ilimitado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Academia Section */}
      <section id="academia" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Academia de Inteligencia Artificial</h2>
            <p className="text-xl text-gray-300">Contenido premium diseñado por expertos en IA</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/30 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cursos Completos</h3>
              <p className="text-gray-400">Acceso a módulos estructurados desde principiante hasta experto en IA</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/30 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Videos HD</h3>
              <p className="text-gray-400">Contenido en video de alta calidad con tracking de progreso</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/30 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clases en Vivo</h3>
              <p className="text-gray-400">Sesiones Zoom con expertos y soporte en tiempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Inversión Simple y Transparente</h2>
            <p className="text-xl text-gray-300">Comienza tu viaje en IA hoy mismo</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500 rounded-2xl p-8">
              <div className="text-sm text-blue-400 font-semibold mb-2">INVERSIÓN ÚNICA</div>
              <div className="text-5xl font-bold text-white mb-2">$89</div>
              <div className="text-gray-400 mb-6">Inscripción</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Acceso a la Academia
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bono Inicio Rápido (Nivel 1): $40
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bono Inicio Rápido (Nivel 2): $8
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  32 PV al sistema binario
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-900/30 rounded-2xl p-8">
              <div className="text-sm text-purple-400 font-semibold mb-2">MENSUALIDAD</div>
              <div className="text-5xl font-bold text-white mb-2">$29</div>
              <div className="text-gray-400 mb-6">Por mes</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mantén tu acceso activo
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  29 PV al sistema binario
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Elegible para comisiones
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Recordatorio 3 días antes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compensation Plan */}
      <section id="compensacion" className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Plan de Compensación Binario</h2>
            <p className="text-xl text-gray-300">Ganancias ilimitadas con carry over infinito</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/30 rounded-xl p-8">
              <div className="text-3xl font-bold text-blue-400 mb-4">Bono Binario</div>
              <div className="text-6xl font-bold text-white mb-4">50%</div>
              <p className="text-gray-300 mb-4">De las ganancias de la pierna menor</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• PV Infinitos</li>
                <li>• Carry Over Ilimitado</li>
                <li>• Sistema de dos piernas</li>
                <li>• Pago semanal</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/30 rounded-xl p-8">
              <div className="text-3xl font-bold text-purple-400 mb-4">Bono de Igualación</div>
              <div className="text-6xl font-bold text-white mb-4">50%</div>
              <p className="text-gray-300 mb-4">De las ganancias binarias de tus directos</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Solo Nivel 1</li>
                <li>• Pago automático</li>
                <li>• Sin límites</li>
                <li>• Incentivo a entrenar</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 border border-green-500/30 rounded-xl p-8">
              <div className="text-3xl font-bold text-green-400 mb-4">Inicio Rápido</div>
              <div className="text-6xl font-bold text-white mb-4">$48</div>
              <p className="text-gray-300 mb-4">Por cada referido directo</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• $40 Nivel 1 (50%)</li>
                <li>• $8 Nivel 2 (10%)</li>
                <li>• Pago inmediato</li>
                <li>• Fácil de ganar</li>
              </ul>
            </div>
          </div>

          {/* Binary Explanation */}
          <div className="mt-16 bg-slate-900/50 border border-blue-900/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">¿Cómo Funciona el Sistema Binario?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Construye Dos Piernas</h4>
                    <p className="text-gray-400">Tu equipo se divide en pierna izquierda y derecha. Cada inscripción genera 32 PV y cada mensualidad 29 PV.</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Gana el 50%</h4>
                    <p className="text-gray-400">Al final de cada ciclo, ganas el 50% del volumen de tu pierna menor. El volumen sobrante se acumula indefinidamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ranks Section */}
      <section id="rangos" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Sistema de Rangos</h2>
            <p className="text-xl text-gray-300">Sube de rango y aumenta tus ganancias mensuales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Rank Cards */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">Afiliado</div>
                <div className="text-3xl font-bold text-white mb-4">$100</div>
                <div className="text-sm text-gray-400 mb-4">100 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-700 rounded-xl p-6 hover:border-blue-500 transition">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">Constructor</div>
                <div className="text-3xl font-bold text-white mb-4">$250</div>
                <div className="text-sm text-gray-400 mb-4">150 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-950 border border-purple-700 rounded-xl p-6 hover:border-purple-500 transition">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">Líder</div>
                <div className="text-3xl font-bold text-white mb-4">$500</div>
                <div className="text-sm text-gray-400 mb-4">300 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-950 border border-green-700 rounded-xl p-6 hover:border-green-500 transition">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">Ejecutivo</div>
                <div className="text-3xl font-bold text-white mb-4">$800</div>
                <div className="text-sm text-gray-400 mb-4">500 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900 to-orange-950 border border-orange-700 rounded-xl p-6 hover:border-orange-500 transition">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">Director</div>
                <div className="text-3xl font-bold text-white mb-4">$1,200</div>
                <div className="text-sm text-gray-400 mb-4">700 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-900 to-cyan-950 border-2 border-cyan-500 rounded-xl p-6 hover:border-cyan-400 transition transform hover:scale-105">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">💎 Diamante</div>
                <div className="text-3xl font-bold text-white mb-4">$2,000</div>
                <div className="text-sm text-gray-400 mb-4">1,000 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900 to-pink-950 border-2 border-pink-500 rounded-xl p-6 hover:border-pink-400 transition transform hover:scale-105">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-2">💎💎 Doble Diamante</div>
                <div className="text-3xl font-bold text-white mb-4">$2,500</div>
                <div className="text-sm text-gray-400 mb-4">1,500 PV pierna menor</div>
                <div className="text-xs text-gray-500">1 directo por pierna</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 border-2 border-yellow-500 rounded-xl p-6 hover:border-yellow-400 transition transform hover:scale-105">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">👑 Imperial Nexus</div>
                <div className="text-3xl font-bold text-white mb-4">$70,000</div>
                <div className="text-sm text-gray-400 mb-4">70,000 PV pierna menor</div>
                <div className="text-xs text-gray-500">Rango máximo</div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/50 rounded-xl p-8 text-center">
            <p className="text-lg text-gray-300">
              <span className="font-bold text-white">Requisito:</span> 1 directo activo por pierna para calificar al bono binario
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Comienza Tu Viaje Hoy
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de estudiantes que ya están dominando la IA y generando ingresos
          </p>
          <button className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl rounded-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 shadow-2xl">
            Registrarse Ahora - $89 USD
          </button>
          <p className="text-sm text-gray-400 mt-4">Pago seguro con USDT (BEP20) • Retiros mínimos de $20 USDT</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-blue-900/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-white font-bold text-xl">Nexus AI</span>
              </div>
              <p className="text-gray-400 text-sm">Academia de Inteligencia Artificial con sistema de compensación binario</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Academia</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Cursos</a></li>
                <li><a href="#" className="hover:text-white transition">Videos</a></li>
                <li><a href="#" className="hover:text-white transition">Clases en Vivo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Negocio</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Plan de Compensación</a></li>
                <li><a href="#" className="hover:text-white transition">Rangos</a></li>
                <li><a href="#" className="hover:text-white transition">Comisiones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Redes Sociales</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-900/20 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Nexus AI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
