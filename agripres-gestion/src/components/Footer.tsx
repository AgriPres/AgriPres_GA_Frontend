import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const Footer: React.FC = () => {
	const year = new Date().getFullYear()

	return (
		<footer className="bg-slate-950 text-slate-200">
			<div className="max-w-7xl mx-auto px-6 py-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
					{/* Marca */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-lime-500 rounded-lg rotate-3"></div>
							<div>
								<p className="text-xl font-bold tracking-tight">AgriPres</p>
								<p className="text-sm text-slate-400">Gestiones Agrícolas</p>
							</div>
						</div>
						<p className="text-sm text-slate-400 leading-relaxed">
							Soluciones agrícolas modernas para planificar, gestionar y
							optimizar tus operaciones agricolas con confianza.
						</p>
						<div className="flex items-center gap-3">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noreferrer"
								className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
								aria-label="Facebook"
							>
								<Facebook size={18} />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer"
								className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
								aria-label="Instagram"
							>
								<Instagram size={18} />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noreferrer"
								className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
								aria-label="LinkedIn"
							>
								<Linkedin size={18} />
							</a>
						</div>
					</div>

					{/* Enlaces */}
					<div>
						<h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
							Navegación
						</h4>
						<ul className="mt-4 space-y-2 text-sm text-slate-400">
							<li>
								<Link to="/" className="hover:text-white transition">
									Inicio
								</Link>
							</li>
							<li>
								<Link to="/About" className="hover:text-white transition">
									información
								</Link>
							</li>
							<li>
								<Link to="/AboutAgripres" className="hover:text-white transition">
									Sobre AgriPres
								</Link>
							</li>
							<li>
								<Link to="/contacto" className="hover:text-white transition">
									Contacto
								</Link>
							</li>
						</ul>
					</div>

					{/* Servicios */}
					<div>
						<h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
							Servicios
						</h4>
						<ul className="mt-4 space-y-2 text-sm text-slate-400">
							<li>Gestión de cultivos</li>
							<li>Planificación de temporadas</li>
							<li>Control de inventario</li>
							<li>Reportes y analítica</li>
						</ul>
					</div>

					{/* Contacto */}
					<div>
						<h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
							Contacto
						</h4>
						<ul className="mt-4 space-y-3 text-sm text-slate-400">
							<li className="flex items-start gap-3">
								<MapPin size={16} className="mt-0.5" />
								<span>San José, Costa Rica</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone size={16} />
								<span>+506 8888 8888</span>
							</li>
							<li className="flex items-center gap-3">
								<Mail size={16} />
								<span>contacto@agripres.com</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
					<span>© {year} AgriPres. Todos los derechos reservados.</span>
					<div className="flex items-center gap-4">
						<a href="#" className="hover:text-white transition">Términos</a>
						<a href="#" className="hover:text-white transition">Privacidad</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
