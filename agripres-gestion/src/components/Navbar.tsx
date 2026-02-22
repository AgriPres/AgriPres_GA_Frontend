import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react' // Importamos los iconos

type NavbarProps = {
  onLoginClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Función para cerrar el menú al hacer clic en un link
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-lime-700/80 backdrop-blur-md border-b border-lime-500 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link to="/" onClick={closeMenu} className="text-2xl font-black text-white tracking-tighter">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-lime-500 rounded-lg rotate-3"></div>
          <span className="text-2xl font-bold text-stone-200 tracking-tight">AgriPres Gestiones Agrícolas</span>
        </div>
        </Link>

        

        {/* ordenador */}
        <div className="hidden md:flex items-center gap-8 text-stone-100 font-medium">
          <Link to="/" className=" font-bold">INICIO</Link>
          <Link to="/About" className=" font-bold">INFORMACIÓN</Link>
          <Link to="/AboutAgripres" className=" font-bold">SOBRE AGRIPRES</Link>
          <Link
            to="/"
            onClick={() => {
              closeMenu()
              onLoginClick()
            }}
            className="bg-lime-700 hover:bg-lime-600 text-stone-100 text-xl px-5 py-1 rounded-full transition-all hover:scale-110 active:scale-100 font-bold border-2 border-lime-800 "
          >
            INICIA SESIÓN
          </Link>
        


        </div>

        
        {/* Mobile Button - Asegúrate de que tenga z-50 */}
        <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-slate-300 hover:text-white transition-colors z-50 relative"
        >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
        <div className={`
        fixed inset-0 w-full h-screen bg-lime-950/98 backdrop-blur-xl z-40 md:hidden transition-all duration-500 ease-in-out
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}>
        
        {/* Contenedor de los links centrado */}
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <Link 
            to="/" 
            onClick={closeMenu} 
            className="text-lg font-medium text-slate-300 hover:text-white tracking-widest transition-all hover:scale-110"
            >
            INICIO
            </Link>
            <Link 
            to="/About" 
            onClick={closeMenu} 
            className="text-lg font-medium text-slate-300 hover:text-white tracking-widest transition-all hover:scale-110"
            >
            INFORMACIÓN
            </Link>
            <Link 
            to="/AboutAgripres" 
            onClick={closeMenu} 
            className="text-lg font-medium text-slate-300 hover:text-white tracking-widest transition-all hover:scale-110"
            >
            SOBRE AGRIPRES
            </Link>
            
            {/* Línea decorativa */}
            <div className="w-8 h-[1px] bg-blue-500/50 my-4"></div>

            <Link
              to="/"
              onClick={() => {
                closeMenu()
                onLoginClick()
              }}
              className="text-sm tracking-widest border border-blue-500 text-blue-400 px-10 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all active:scale-95"
            >
              INICIA SESIÓN
            </Link>
        </div>
        </div>
        
    </nav>
  )
}

export default Navbar