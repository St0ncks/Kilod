import React, { useState, useEffect } from 'react';
import { Order, MerchandiseItem, ViewMode } from '../types';
import MerchandiseInput from './MerchandiseInput';

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
}

// Moved InputField outside the OrderForm component
const InputField: React.FC<InputFieldProps> = 
    ({label, id, type="text", value, onChange, error, placeholder, maxLength}) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error-message` : undefined}
      />
      {error && <p id={`${id}-error-message`} className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

interface OrderFormProps {
  onSave: (order: Order) => void;
  onCancel: () => void;
  existingOrder?: Order | null;
  nextOrderIdFormatted: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSave, onCancel, existingOrder, nextOrderIdFormatted }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState<string>(''); // Stored as string for input flexibility
  const [pickupDate, setPickupDate] = useState('');
  const [merchandise, setMerchandise] = useState<MerchandiseItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingOrder) {
      setFirstName(existingOrder.firstName);
      setLastName(existingOrder.lastName);
      setCode(String(existingOrder.code));
      setPickupDate(existingOrder.pickupDate);
      setMerchandise(existingOrder.merchandise.map(m => ({...m, id: m.id || Date.now().toString() + Math.random()}))); // ensure id for keys
    } else {
      // Reset form for new order
      setFirstName('');
      setLastName('');
      setCode('');
      setPickupDate(new Date().toISOString().split('T')[0]); // Default to today
      setMerchandise([]);
    }
  }, [existingOrder]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "Il nome è obbligatorio.";
    if (!lastName.trim()) newErrors.lastName = "Il cognome è obbligatorio.";
    if (!code.trim() || !/^\d+$/.test(code)) newErrors.code = "Il codice deve essere un numero intero.";
    if (!pickupDate) newErrors.pickupDate = "La data di ritiro è obbligatoria.";
    if (merchandise.length === 0) newErrors.merchandise = "Aggiungere almeno un articolo di merce.";
    
    // Validate merchandise item codes
    merchandise.forEach(item => {
        if (!/^\d{8}$/.test(item.itemCode)) {
            newErrors.merchandise = newErrors.merchandise ? newErrors.merchandise + ` Il codice merce '${item.itemCode}' non è valido.` : `Il codice merce '${item.itemCode}' non è valido (deve essere di 8 cifre).`;
        }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderData: Order = {
      id: existingOrder ? existingOrder.id : nextOrderIdFormatted,
      firstName,
      lastName,
      code: parseInt(code, 10),
      pickupDate,
      merchandise,
      createdAt: existingOrder ? existingOrder.createdAt : new Date().toISOString(),
    };
    onSave(orderData);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {existingOrder ? `Modifica Ordine ${existingOrder.id}` : 'Aggiungi Nuovo Ordine'}
      </h2>
      {!existingOrder && <p className="mb-4 text-sm text-gray-600">Prossimo Codice Identificativo: <span className="font-bold text-indigo-600">{nextOrderIdFormatted}</span></p>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Nome" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} placeholder="Mario"/>
          <InputField label="Cognome" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} placeholder="Rossi"/>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Codice (intero)" id="code" type="text" value={code} 
            onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) { // Allow only digits
                    setCode(val);
                }
            }} 
            error={errors.code} placeholder="12345"/>
          <InputField label="Data di Ritiro" id="pickupDate" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} error={errors.pickupDate}/>
        </div>

        <MerchandiseInput merchandise={merchandise} setMerchandise={setMerchandise} />
        {errors.merchandise && <p className="text-xs text-red-500">{errors.merchandise}</p>}

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            {existingOrder ? 'Salva Modifiche' : 'Salva Ordine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;