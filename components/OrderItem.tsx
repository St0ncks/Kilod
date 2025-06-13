
import React from 'react';
import { Order } from '../types';
import { EditIcon, TrashIcon, PrintIcon } from '../constants';

interface OrderItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onPrint: (order: Order) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onEdit, onDelete, onPrint }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch (e) {
        return dateString; // fallback
    }
  };

  return (
    <div id={`order-item-${order.id}`} className="bg-white shadow-lg rounded-lg p-5 mb-4 hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b border-gray-200">
        <div>
            <h3 className="text-xl font-semibold text-indigo-700">{order.firstName} {order.lastName}</h3>
            <p className="text-sm text-gray-500">Codice Identificativo: <span className="font-medium text-gray-700">{order.id}</span></p>
        </div>
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <button
            onClick={() => onEdit(order)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
            title="Modifica Ordine"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPrint(order)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
            title="Stampa Ordine"
          >
            <PrintIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
            title="Elimina Ordine"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <p><span className="font-medium text-gray-600">Codice Interno:</span> {order.code}</p>
        <p><span className="font-medium text-gray-600">Data Ritiro:</span> {formatDate(order.pickupDate)}</p>
        <p><span className="font-medium text-gray-600">Data Creazione:</span> {formatDate(order.createdAt)}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-600 mb-1">Merce:</h4>
        {order.merchandise.length > 0 ? (
          <ul className="list-disc list-inside pl-1 space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2 rounded-md">
            {order.merchandise.map((item, index) => (
              <li key={item.id || index} className="text-sm text-gray-700">
                <span className="font-semibold">{item.itemCode}</span>: {item.itemName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">Nessuna merce specificata.</p>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
