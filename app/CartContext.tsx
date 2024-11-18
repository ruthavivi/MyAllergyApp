// CartContext.tsx
import React, { createContext, useState, useContext } from 'react';

// הגדרת סוגי ה-Context
interface CartContextType {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
}

// יצירת ה-Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook לשימוש ב-Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// עטיפה עם CartProvider
export const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<any[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
