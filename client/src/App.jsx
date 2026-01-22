import React, { useState } from 'react';
import BillingScreen from './components/BillingScreen';
import MenuList from './components/menu/MenuList';
import { LayoutDashboard, Utensils } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('billing');

  return (
    <div className="App flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="bg-dark text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md z-10 gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Utensils size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SecondWife POS</span>
        </div>
        <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center">
          <button 
            onClick={() => setCurrentView('billing')}
            className={`flex-1 md:flex-none justify-center md:justify-start items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
              currentView === 'billing' ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard size={18} />
            Billing
          </button>
          <button 
            onClick={() => setCurrentView('menu')}
            className={`flex-1 md:flex-none justify-center md:justify-start items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
              currentView === 'menu' ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-800'
            }`}
          >
            <Utensils size={18} />
            Menu
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        {currentView === 'billing' ? <BillingScreen /> : <MenuList />}
      </main>
    </div>
  );
}

export default App;
