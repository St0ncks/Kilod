
import React from 'react';
import { Order } from '../types';
import OrderItem from './OrderItem';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onPrint: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onEdit, onDelete, onPrint }) => {
  if (orders.length === 0) {
    return <p className="text-center text-gray-500 py-10 text-lg">Nessun ordine trovato. Prova ad aggiungerne uno!</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <OrderItem
          key={order.id}
          order={order}
          onEdit={onEdit}
          onDelete={onDelete}
          onPrint={onPrint}
        />
      ))}
    </div>
  );
};

export default OrderList;
