import React, { useState } from 'react' // Importamos el Hook para el estado
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import About from './components/About'
import AboutAgripres from './components/AboutAgripres'

type HomeProps = {
  showLogin: boolean
  setShowLogin: (value: boolean) => void
}

const Home: React.FC<HomeProps> = ({ showLogin, setShowLogin }) => {

  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-black text-black mb-6">
          Gestiona las horas de riego con <span className="text-lime-500">AgriPres</span>
        </h1>
        <p className="text-slate-700 text-lg mb-8">
          Una herramienta sencilla para coordinar turnos, registrar aperturas del pozo y ver el
          consumo de horas de cada agricultor.
        </p>

        {!showLogin && (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-lime-500 hover:bg-lime-400 text-neutral-900 font-semibold text-lg px-6 py-3 rounded-full transition-all"
          >
            Iniciar sesión
          </button>
        )}

        {showLogin && (
          <div className="mt-8 max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left relative">
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Accede a tu cuenta</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Tu usuario"
                  className="w-full rounded-lg text-black border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  className="w-full rounded-lg border text-black border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Entrar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}




const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <Router>
      <div className="bg-stone-100 min-h-screen text-white flex flex-col">
        <Navbar onLoginClick={() => setShowLogin(true)} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home showLogin={showLogin} setShowLogin={setShowLogin} />} />
            <Route path="/About" element={<About />} />
            <Route path="/AboutAgripres" element={<AboutAgripres />} />
            
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App