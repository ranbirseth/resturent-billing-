import React, { useState, useEffect } from 'react';
import { getMenuItems, createOrder } from '../services/api';
import { ShoppingCart, Plus, Minus, Trash2, Printer, Share2, Receipt, Search, XCircle } from 'lucide-react';
import PrintableBill from './PrintableBill';
import CategoryFilter from './menu/CategoryFilter';

const BillingScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [generatedBill, setGeneratedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [activeCategory]);

  const fetchMenu = async () => {
    try {
      const { data } = await getMenuItems(activeCategory);
      // Filter for billing: must be available and not deleted
      const availableItems = data.filter(item => item.isAvailable && !item.isDeleted);
      setMenuItems(availableItems);

      // Unique categories for filter (only if not filtering already)
      if (!activeCategory) {
        const cats = [...new Set(data.map(item => item.category))];
        setCategories(cats);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = Math.round(subtotal * 0.05);
  const total = Math.round(subtotal + gst - discount);

  const handleGenerateBill = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    setLoading(true);
    try {
      const orderData = {
        items: cart,
        discount,
        paymentMode
      };
      const { data } = await createOrder(orderData);
      setGeneratedBill(data);
      setCart([]); // Clear cart after success
      setIsCartOpen(false);
    } catch (error) {
      alert('Error generating bill: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredVisibleItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (generatedBill) {
    return <PrintableBill bill={generatedBill} onBack={() => setGeneratedBill(null)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-100 overflow-hidden font-sans relative">
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Menu Side */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden h-[calc(100vh-140px)] md:h-full order-1 md:order-2 pb-20 md:pb-6">
        <header className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 gap-3 md:gap-0">
           <div className="relative flex-1 max-w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Quick search menu..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          <div className="text-gray-500 font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 italic text-center md:text-left">
            {activeCategory || 'All Categories'}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 content-start pb-20 md:pb-0">
          {filteredVisibleItems.map(item => (
            <button
              key={item._id}
              onClick={() => addToCart(item)}
              className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col justify-between group h-32 md:h-40"
            >
              <div>
                <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md">{item.category}</span>
                <h3 className="text-sm md:text-lg font-bold text-gray-800 mt-2 line-clamp-2 leading-tight">{item.name}</h3>
              </div>
              <div className="flex justify-between items-center mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-50">
                <span className="text-sm md:text-xl font-black text-gray-900 tracking-tight">₹{item.price}</span>
                <div className="bg-gray-50 p-1.5 md:p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all group-hover:rotate-90">
                  <Plus size={16} className="md:w-5 md:h-5" />
                </div>
              </div>
            </button>
          ))}
          {filteredVisibleItems.length === 0 && (
            <div className="col-span-full h-full flex flex-col items-center justify-center text-gray-400 py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
               <Receipt size={48} className="opacity-10 mb-2" />
               <p className="font-bold">No active items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cart Toggle Bar (Sticky Bottom) - Visible only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex items-center justify-between" onClick={() => setIsCartOpen(!isCartOpen)}>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full text-primary relative">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total</span>
            <span className="text-xl font-black text-gray-900">₹{total}</span>
          </div>
        </div>
        <button 
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-100 flex items-center gap-2"
        >
          {isCartOpen ? 'Hide Order' : 'View Order'}
        </button>
      </div>

      {/* Tablet Floating Cart Button - Visible on Tablet and hidden on Desktop/Mobile */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="hidden md:flex lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-2xl shadow-orange-200 hover:scale-105 transition-transform items-center justify-center gap-2"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {cart.length}
            </span>
          )}
        </div>
      </button>

      {/* Bill Side / Bottom Sheet / Slide-in Drawer */}
      {/* Overlay for mobile and tablet when cart is open */}
      {isCartOpen && (
        <div 
          className="md:fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`
        fixed lg:relative 
        bottom-0 left-0 right-0 top-auto 
        md:top-0 md:bottom-0 md:left-auto md:right-0
        h-[85vh] md:h-full 
        w-full md:w-[400px] 
        bg-white 
        border-t md:border-t-0 md:border-l border-gray-200 
        flex flex-col 
        shadow-[0_-10px_40px_rgba(0,0,0,0.2)] lg:shadow-2xl 
        z-50 
        transition-transform duration-300 ease-in-out
        ${isCartOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full lg:translate-x-0'}
        lg:transform-none
        rounded-t-3xl md:rounded-none
        order-2 lg:order-3
      `}>
        {/* Mobile Header indicator */}
        <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-2 bg-white sticky top-0 md:static rounded-t-3xl md:rounded-none">
          <ShoppingCart className="text-primary" />
          <h2 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">Current Order</h2>
          <span className="ml-auto bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black">
            {cart.length} ITEMS
          </span>
          <button onClick={() => setIsCartOpen(false)} className="lg:hidden ml-2 p-2 text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-2">
                <ShoppingCart size={32} />
              </div>
              <p className="font-bold text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 group animate-in slide-in-from-right-4 duration-200">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] font-bold text-gray-400">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                  <button onClick={() => updateQuantity(item._id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-red-500 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-gray-200 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,10.02)] pb-8 md:pb-6">
          <div className="space-y-1 md:space-y-2">
            <div className="flex justify-between items-center text-gray-600 text-xs md:text-sm font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 text-xs md:text-sm font-medium">
              <span>GST (5%)</span>
              <span className="font-bold text-gray-800">₹{gst}</span>
            </div>
            <div className="flex justify-between items-center gap-4 py-1 border-t border-gray-50 mt-1">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Discount</span>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="text-gray-400 font-bold text-xs">₹</span>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 bg-transparent text-right focus:outline-none font-bold text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between items-end mb-2 md:mb-6 mt-2 md:mt-4">
              <div>
                <span className="block text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Payable</span>
                <span className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter">₹{total}</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  {['Cash', 'UPI', 'Card'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] font-black transition-all ${
                        paymentMode === mode 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateBill}
              disabled={loading || cart.length === 0}
              className="w-full bg-primary hover:bg-orange-600 disabled:bg-gray-300 text-white font-black py-3 md:py-5 rounded-2xl shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-3 text-sm md:text-lg"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Receipt size={20} className="md:w-6 md:h-6" />
                  GENERATE BILL
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingScreen;
