import { useState, useEffect } from 'react';

// Create a custom event for favorites changes
const favoritesChangeEvent = new CustomEvent('favoritesChange', { detail: null });

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('propertyFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Save to localStorage and create event with current favorites
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
    
    // Create a new event with the current favorites data
    const event = new CustomEvent('favoritesChange', { detail: favorites });
    window.dispatchEvent(event);
  }, [favorites]);

  // Add listener for favorites changes from other components
  useEffect(() => {
    const handleFavoritesChange = (event: CustomEvent) => {
      const newFavorites = event.detail;
      if (newFavorites) {
        setFavorites(newFavorites);
      }
    };

    window.addEventListener('favoritesChange', handleFavoritesChange);
    return () => window.removeEventListener('favoritesChange', handleFavoritesChange);
  }, []);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return { favorites, toggleFavorite, isFavorite };
};