
import React, { useState } from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#1a120b] border-t border-slate-200 dark:border-slate-800 py-12 px-6 md:px-20 lg:px-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4 text-slate-900 dark:text-white">
              <Logo className="size-12" />
              <h2 className="text-2xl font-black">RIFASFULLPROJECT</h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              La plataforma líder en rifas digitales en Venezuela. Seguridad, transparencia y los mejores premios para todos.
            </p>
            <div className="flex gap-4 text-slate-400">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary">public</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary">thumb_up</span>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary">mail</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Plataforma</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Rifas Activas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ganadores</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-sm">call</span> +58 412 123 4567</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400 text-sm">mail</span> hola@rifasfullproject.com</li>
              <li className="mt-4 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide border border-emerald-100 dark:border-emerald-800">
                <span className="material-symbols-outlined text-sm">verified_user</span> Pagos Seguros
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          © 2024 RIFASFULLPROJECT. Todos los derechos reservados. Pagos procesados vía Pago Móvil.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
