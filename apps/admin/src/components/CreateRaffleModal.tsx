import React, { useState } from 'react';
import { raffleService } from '@rifasfull/core';

interface CreateRaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRaffleCreated: () => void;
}

const CreateRaffleModal = ({ isOpen, onClose, onRaffleCreated }: CreateRaffleModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    totalTickets: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return false;
    }
    if (!formData.totalTickets || parseInt(formData.totalTickets) <= 0) {
      setError('El número de tickets debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      await raffleService.createRaffle({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        total_tickets: parseInt(formData.totalTickets)
      });
      
      // Reset form y cerrar modal
      setFormData({ title: '', description: '', price: '', totalTickets: '' });
      onRaffleCreated(); // Recargar la lista de rifas
      onClose();
      
    } catch (err) {
      console.error('Error creando rifa:', err);
      setError('Error al crear la rifa. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-card-dark shadow-xl transition-all w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary px-6 py-4">
            <h3 className="text-lg font-bold text-white">Crear Nueva Rifa</h3>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* Título */}
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: iPhone 15 Pro"
                required
              />
            </div>
            
            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Detalles de la rifa..."
              />
            </div>
            
            {/* Precio */}
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">
                Precio por ticket ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10.00"
                required
              />
            </div>
            
            {/* Total Tickets */}
            <div className="mb-6">
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">
                Total de tickets *
              </label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-slate-200 dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="100"
                required
              />
            </div>
            
            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-border-dark rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Rifa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRaffleModal;