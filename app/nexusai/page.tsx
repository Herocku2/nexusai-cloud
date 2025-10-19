import Link from "next/link";

export const metadata = {
  title: "NexusAI Cloud — Landing",
  description: "Academia de IA + Red Binaria"
};

export default function NexusAiLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <Link href="/" aria-label="Inicio" className="flex items-center gap-3">
            <img src="/assets/images/logo%20nexus%20ai.png" alt="Nexus AI" width={200} height={72} className="h-18 w-auto" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/auth/sign-up" className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Crear cuenta</Link>
            <Link href="/pricing" className="inline-flex items-center rounded-md border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">Planes</Link>
          </nav>
        </header>

        {/* Hero */}
        <main>
          <section className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">NexusAI Cloud — Academia de Inteligencia Artificial + Red Binaria</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl">Aprende y genera ingresos con un ecosistema que combina formación en IA, membresías mensuales y un plan de compensación transparente. Bonos de Inicio Rápido, Binario con carry over ilimitado y rango por sumatoria de ganancias.</p>
                <div className="mt-6 flex gap-4">
                  <Link href="/auth/sign-up" className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">Empezar ahora</Link>
                  <Link href="/faq" className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50">¿Cómo funciona?</Link>
                </div>
                <div className="mt-6 flex items-center gap-3 text-slate-500">
                  <span>Síguenos:</span>
                  <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-indigo-600">Instagram</a>
                  <a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube" className="hover:text-indigo-600">YouTube</a>
                  <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-indigo-600">Facebook</a>
                </div>
              </div>
              <div className="relative">
                <img src="/assets/images/nexus%20picture1.png" alt="Ilustración NexusAI" width={786} height={585} className="w-full h-auto rounded-xl shadow-sm" />
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {title:"Bonos de Inicio Rápido", desc:"Hasta 40% según paquete. Se paga por cada venta directa en primera compra."},
                {title:"Plan Binario", desc:"Carry over ilimitado. Se paga por suma mínima de ambas piernas con 10 USDT mensual de calificación."},
                {title:"Rangos por ganancias", desc:"Rangos como Junior, Senior, Master, Elite, Legend según acumulado de ganancias."},
                {title:"Academia de IA", desc:"Formación continua con herramientas y cursos de IA para crecimiento profesional."},
                {title:"Membresía mensual", desc:"Planes desde 10 USDT al mes. Recordatorios automáticos antes de vencer la calificación."},
                {title:"Retiros simples", desc:"Mínimo 20 USDT y fee 3%. Notificaciones y recordatorios por email."}
              ].map((f, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h6 className="font-semibold mb-2">{f.title}</h6>
                  <p className="text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-10">
            <div className="rounded-2xl bg-indigo-50 p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h5 className="font-semibold mb-1">Únete a NexusAI Cloud</h5>
                  <p className="text-slate-600">Activa tu membresía, accede a la academia y construye tu red.</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/auth/sign-up" className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">Crear cuenta</Link>
                  <Link href="/pricing" className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50">Ver precios</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}