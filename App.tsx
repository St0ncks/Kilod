
import React, { useState, useEffect, useCallback } from 'react';
import { Order, ViewMode, MerchandiseItem } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import SearchBar from './components/SearchBar';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon, APP_TITLE, LOCAL_STORAGE_ORDERS_KEY, LOCAL_STORAGE_NEXT_ID_KEY } from './constants';

const App: React.FC = () => {
  const [orders, setOrders] = useLocalStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
  const [nextId, setNextId] = useLocalStorage<number>(LOCAL_STORAGE_NEXT_ID_KEY, 1);
  
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LIST);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  const generateOrderId = useCallback((): string => {
    return `ORD-${String(nextId).padStart(4, '0')}`;
  }, [nextId]);
  
  const [nextOrderIdFormatted, setNextOrderIdFormatted] = useState<string>(generateOrderId());

  useEffect(() => {
    setNextOrderIdFormatted(generateOrderId());
  }, [nextId, generateOrderId]);


  const handleSaveOrder = (orderData: Order) => {
    if (editingOrder) {
      setOrders(prevOrders => prevOrders.map(o => o.id === orderData.id ? orderData : o));
    } else {
      const newOrderWithId = { ...orderData, id: generateOrderId() };
      setOrders(prevOrders => [...prevOrders, newOrderWithId].sort((a,b) => b.createdAt.localeCompare(a.createdAt))); // Sort by newest first
      setNextId(prevId => prevId + 1);
    }
    setCurrentView(ViewMode.LIST);
    setEditingOrder(null);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setCurrentView(ViewMode.FORM);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDeleteId(orderId);
  };

  const confirmDeleteOrder = () => {
    if (orderToDeleteId) {
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderToDeleteId));
      setOrderToDeleteId(null);
    }
  };

  const handlePrintOrder = (order: Order) => {
    console.log("handlePrintOrder called for order:", order.id);
    setOrderToPrint(order);
  };
  
  useEffect(() => {
    if (orderToPrint) {
      console.log("useEffect triggered for printing order:", orderToPrint.id);
      const printSection = document.getElementById('print-section');
      
      if (printSection) {
        console.log("Print section element found.");
        try {
          const merchandiseList = orderToPrint.merchandise
            .map(m => `<li>${m.itemCode || 'N/A'}: ${m.itemName || 'N/A'}</li>`)
            .join('');

          let pickupDateFormatted = 'N/A';
          if (orderToPrint.pickupDate) {
            try {
              pickupDateFormatted = new Date(orderToPrint.pickupDate).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            } catch (e) { 
              console.error("Error formatting pickupDate:", orderToPrint.pickupDate, e);
            }
          }

          let createdAtFormatted = 'N/A';
          if (orderToPrint.createdAt) {
            try {
              createdAtFormatted = new Date(orderToPrint.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
            } catch (e) {
              console.error("Error formatting createdAt:", orderToPrint.createdAt, e);
            }
          }

          const printContent = `
            <div style="padding: 20px; font-family: Arial, sans-serif; color: #333;">
              <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1a237e;">Dettaglio Ordine: ${orderToPrint.id}</h1>
              <div style="margin-bottom: 16px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                <p style="margin: 5px 0;"><strong>Nome:</strong> ${orderToPrint.firstName || ''}</p>
                <p style="margin: 5px 0;"><strong>Cognome:</strong> ${orderToPrint.lastName || ''}</p>
                <p style="margin: 5px 0;"><strong>Codice Interno:</strong> ${orderToPrint.code || ''}</p>
                <p style="margin: 5px 0;"><strong>Data Ritiro:</strong> ${pickupDateFormatted}</p>
                <p style="margin: 5px 0;"><strong>Data Creazione:</strong> ${createdAtFormatted}</p>
              </div>
              <h2 style="font-size: 20px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #1a237e;">Merce:</h2>
              ${orderToPrint.merchandise.length > 0 ? `<ul style="list-style-type: disc; padding-left: 20px; margin:0; border: 1px solid #eee; padding: 10px; border-radius: 5px;">${merchandiseList}</ul>` : '<p style="font-style: italic;">Nessuna merce.</p>'}
            </div>
          `;
          
          console.log("Generated print content (using inline styles).");
          printSection.innerHTML = printContent;
          
          console.log("Calling window.print()...");
          window.print();
          console.log("window.print() call completed (dialog should have shown/closed).");

          // Clean up the print section after printing
          // printSection.innerHTML = ''; // Clearing immediately might be too soon if print is async in some way,
                                       // but generally window.print() is blocking.
                                       // Let's keep it to ensure it's clean for next time.
        } catch (error) {
          console.error("Error during print content preparation or window.print() call:", error);
        } finally {
            // It's important to clear the print section regardless of success/failure of print dialog
            if(printSection) printSection.innerHTML = '';
        }
      } else {
        console.error("Print section with ID 'print-section' not found in the DOM.");
      }
      // Reset orderToPrint state variable to allow printing the same order again if needed
      // and to signify that the print operation is done.
      setOrderToPrint(null); 
      console.log("orderToPrint state reset to null.");
    }
  }, [orderToPrint]);


  const filteredOrders = orders.filter(order =>
    order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => b.createdAt.localeCompare(a.createdAt));


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          {APP_TITLE}
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {currentView === ViewMode.LIST && (
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <button
                onClick={() => { setEditingOrder(null); setCurrentView(ViewMode.FORM); }}
                className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Aggiungi Nuovo Ordine
              </button>
            </div>
            <OrderList
              orders={filteredOrders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onPrint={handlePrintOrder}
            />
          </div>
        )}

        {currentView === ViewMode.FORM && (
          <OrderForm
            onSave={handleSaveOrder}
            onCancel={() => { setCurrentView(ViewMode.LIST); setEditingOrder(null); }}
            existingOrder={editingOrder}
            nextOrderIdFormatted={nextOrderIdFormatted}
          />
        )}
      </main>

      <ConfirmationModal
        isOpen={!!orderToDeleteId}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare l'ordine ${orderToDeleteId}? L'azione è irreversibile.`}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setOrderToDeleteId(null)}
        confirmButtonText="Elimina Definitivamente"
      />
      
      <footer className="text-center mt-12 py-6 border-t border-slate-400">
        <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} Gestione Ordini. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
};

export default App;
