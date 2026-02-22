import React from 'react'

const About: React.FC = () => {
  const steps = [
    {
      title: 'Registro y acceso seguro',
      description:
        'Cada agricultor entra con su usuario para ver su historial y el estado actual de su consumo.'
    },
    {
      title: 'Control de apertura del pozo',
      description:
        'La comunidad puede planificar turnos de riego y registrar la apertura/cierre de forma ordenada.'
    },
    {
      title: 'Seguimiento de horas',
      description:
        'El sistema muestra las horas usadas por usuario y los pendientes del mes para evitar confusiones.'
    },
    {
      title: 'Reportes claros',
      description:
        'Se generan reportes simples para decisiones rápidas y una gestión más justa del recurso.'
    }
  ]

  return (
    <section className="pt-32 pb-20 px-6 min-h-screen bg-stone-100 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="w-44 h-44 bg-gradient-to-tr from-lime-500 to-emerald-400 rounded-3xl rotate-2 flex-shrink-0 shadow-2xl shadow-lime-500/20"></div>
          <div>
            <h2 className="text-4xl text-black font-black mb-4">Sobre AgriPres Gestiones Agricolas</h2>
            <p className="text-slate-700 text-lg leading-relaxed">
              AgriPres Gestiones Agricolas es una plataforma creada para la gestión eficiente de las horas de riego en
              comunidades de agricultores. Centraliza la información del pozo y facilita la
              coordinación de turnos para que el recurso se use de forma transparente y ordenada.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
          <h3 className="text-2xl text-black font-bold mb-3">¿Cómo funciona?</h3>
          <p className="text-slate-700 mb-8">
            Cada usuario puede ver sus horas consumidas, sus turnos registrados y el estado general
            del pozo. Los encargados registran aperturas y cierres, y el sistema mantiene un historial
            claro para toda la comunidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <h4 className="font-semibold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-700 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-lime-600 mb-2">Transparencia</h4>
            <p className="text-slate-700 text-sm">
              Todos los registros quedan visibles para evitar errores y mejorar la confianza.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-emerald-600 mb-2">Orden</h4>
            <p className="text-slate-700 text-sm">
              Turnos claros, tiempos registrados y control de consumo en un solo lugar.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <h4 className="font-bold text-blue-600 mb-2">Comunidad</h4>
            <p className="text-slate-700 text-sm">
              Una herramienta pensada para la colaboración entre agricultores.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About