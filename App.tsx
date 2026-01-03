
import React, { useState, useEffect, useCallback } from 'react';
import { AppCategory, FlashCard } from './types';
import { generateMoreCards } from './services/geminiService';
import Card from './components/Card';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<AppCategory>(AppCategory.DAILY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchCards = useCallback(async (selectedCategory: AppCategory, reset = false) => {
    setLoading(true);
    try {
      const newCards = await generateMoreCards(selectedCategory);
      if (reset) {
        setCards(newCards);
        setCurrentIndex(0);
      } else {
        setCards(prev => [...prev, ...newCards]);
      }
    } catch (error) {
      console.error("Kartlar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards(category, true);
  }, [category, fetchCards]);

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // If we reach the end of the current 100, fetch another 100
      fetchCards(category);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">KANKA</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full flex justify-between items-center mb-6 max-w-sm">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{category}</span>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
            {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : 'Hazırlanıyor...'}
          </span>
        </div>

        <div className="w-full flex flex-col items-center gap-8">
          {loading && cards.length === 0 ? (
            <div className="w-full max-w-sm h-96 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center flex-col gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center px-6">
                <p className="text-gray-800 font-bold text-lg">Kanka Hazırlanıyor</p>
                <p className="text-gray-500 text-sm mt-1">Senin için 100 yeni cümle oluşturuyoruz, bu biraz zaman alabilir...</p>
              </div>
            </div>
          ) : currentCard ? (
            <Card key={currentCard.id} card={currentCard} />
          ) : null}

          {/* Navigation Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={prevCard}
              disabled={currentIndex === 0 || loading}
              className={`p-4 rounded-full shadow-lg transition-all ${currentIndex === 0 ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-700 hover:scale-110 active:scale-95'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={nextCard}
              disabled={loading}
              className="bg-indigo-600 text-white p-6 rounded-full shadow-xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative overflow-hidden"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="p-8 text-center">
        <p className="text-gray-400 text-sm font-medium">Karta dokunarak Almanca karşılığını öğren!</p>
      </footer>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar / Category Selection */}
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-800">Kategoriler</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto pr-2">
            {Object.values(AppCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-4 rounded-2xl font-semibold transition-all ${category === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-auto border-t pt-8">
            <div className="bg-indigo-50 p-6 rounded-3xl">
              <p className="text-indigo-900 font-bold mb-1">Kanka Bilgi 💡</p>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Şu an her kategoride 100 kartlık dev setler yüklüyoruz. Toplamda binlerce cümle seni bekliyor!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
