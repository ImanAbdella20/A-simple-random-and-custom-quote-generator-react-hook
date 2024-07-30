import React, { useState, useEffect } from 'react';

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
              <li key={index}>{fav.text} - {fav.author}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Index;
