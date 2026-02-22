import React from 'react';

// Definimos una interfaz para los miembros del equipo
interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const team: TeamMember[] = [
  { name: 'Isaac Sbai', role: 'Ingeniero', imageUrl: '/vite.svg' },
  { name: 'Smael Sbai', role: 'Ingeniero', imageUrl: '/vite.svg' },
  { name: 'Jose Luis Pendón', role: 'Ingeniero', imageUrl: '/vite.svg' },
  { name: 'Juan Miguel Maldonado', role: 'Sales Manager', imageUrl: '/vite.svg' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="bg-stone-100 text-black">
      {/* Hero Section */}
      <section className="py-20 bg-stone-100 text-center">
        <h1 className="text-4xl font-black mb-4 mt-16   ">Por un futuro juntos</h1>
        <p className="max-w-2xl mx-auto text-2xl text-slate-700">
          AgriPres está formado por un equipo de profesionales apasionados por la tecnología y la creación de soluciones dedicadas al sector agrícola.
        </p>
      </section>

      {/* Misión y Visión */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-black mb-4">Nuestra Misión</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-700">Facilitar la vida de los agricultores mediante herramientas eficientes y escalables.</p>
        </div>
        <div>
          <h2 className="text-3xl font-black mb-4">Nuestra Visión</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-700">Transformar el sector agrícola mediante soluciones tecnológicas innovadoras.</p>
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Conoce al equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-lg shadow-md text-center">
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-xl">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;