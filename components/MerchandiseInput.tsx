
import React from 'react';
import { MerchandiseItem } from '../types';
import { TrashIcon, PlusIcon } from '../constants';

interface MerchandiseInputProps {
  merchandise: MerchandiseItem[];
  setMerchandise: React.Dispatch<React.SetStateAction<MerchandiseItem[]>>;
}

const MerchandiseInput: React.FC<MerchandiseInputProps> = ({ merchandise, setMerchandise }) => {
  const [currentItemCode, setCurrentItemCode] = React.useState('');
  const [currentItemName, setCurrentItemName] = React.useState('');
  const [itemCodeError, setItemCodeError] = React.useState('');

  const handleAddItem = () => {
    if (!/^\d{8}$/.test(currentItemCode)) {
      setItemCodeError('Il codice merce deve essere di 8 cifre numeriche.');
      return;
    }
    setItemCodeError('');
    if (currentItemName.trim() === '') {
        // Optionally, add validation for item name
        alert("Il nome dell'oggetto non può essere vuoto.");
        return;
    }

    setMerchandise([...merchandise, { id: Date.now().toString(), itemCode: currentItemCode, itemName: currentItemName }]);
    setCurrentItemCode('');
    setCurrentItemName('');
  };

  const handleRemoveItem = (id: string) => {
    setMerchandise(merchandise.filter(item => item.id !== id));
  };

  const handleItemCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 8) {
        setCurrentItemCode(value);
        if (value.length === 8 || value.length === 0) {
            setItemCodeError('');
        }
    }
  };


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Merce</h3>
      {merchandise.length > 0 && (
        <ul className="space-y-2 border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto">
          {merchandise.map((item, index) => (
            <li key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="text-sm">
                <span className="font-semibold text-gray-700">{item.itemCode}</span> - <span className="text-gray-600">{item.itemName}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Rimuovi merce"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-3 border border-dashed border-gray-300 rounded-md">
        <div className="md:col-span-1">
          <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700">Codice Merce (8 cifre)</label>
          <input
            type="text"
            id="itemCode"
            value={currentItemCode}
            onChange={handleItemCodeChange}
            className={`mt-1 block w-full px-3 py-2 border ${itemCodeError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="Es. 12345678"
            maxLength={8}
          />
          {itemCodeError && <p className="text-xs text-red-500 mt-1">{itemCodeError}</p>}
        </div>
        <div className="md:col-span-1">
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Nome Oggetto</label>
          <input
            type="text"
            id="itemName"
            value={currentItemName}
            onChange={(e) => setCurrentItemName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Es. Maglietta"
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          disabled={currentItemCode.length !== 8 || !currentItemName.trim()}
          className="md:col-span-1 mt-1 w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Aggiungi Merce
        </button>
      </div>
    </div>
  );
};

export default MerchandiseInput;
