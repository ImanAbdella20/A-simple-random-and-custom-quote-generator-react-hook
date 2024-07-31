import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Quote {
  text: string;
  author: string;
}

const Index = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quote, setQuote] = useState<Quote>({
    text: "It is only with the heart that one can see rightly, what is essential is invisible to the eye.",
    author: "- Antoine de Saint-Exupery"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch("https://type.fit/api/quotes");
        const data: Quote[] = await response.json();
        setQuotes(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch quotes");
        setLoading(false);
      }
    };
    loadQuotes();
  }, []);

  const randomQuote = () => {
    const select = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(select);
  };

  const addFavorite = () => {
    setFavorites([...favorites, quote]);
  };

  const deleteFavorite = (index: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this quote?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        setFavorites(favorites.filter((_, i) => i !== index));
        Swal.fire({
          title: 'Deleted!',
          text: 'Quote removed from favorites!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className='contain'>
        <p>{quote.text}</p>
        <p>{quote.author}</p>
        <button onClick={randomQuote}>New Quote</button>
        <button onClick={addFavorite}>Add to Favorites</button>
        <div>
          <h3>Favorites</h3>
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>
                {fav.text} - {fav.author}
                <button onClick={() => deleteFavorite(index)}>X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Index;
