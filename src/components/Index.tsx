import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Quote {
  text: string;
  author: string;
}

const Index: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quote, setQuote] = useState<Quote>({
    text: "It is only with the heart that one can see rightly, what is essential is invisible to the eye.",
    author: "- Antoine de Saint-Exupery"
  });
  const [customQuote, setCustomQuote] = useState<Quote>({ text: "", author: "" });
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadQuotes = async () => {
      try {
        const response = await fetch("https://type.fit/api/quotes");
        const data: Quote[] = await response.json();
        setQuotes(data);
      } catch (err) {
        console.error("Failed to fetch quotes", err);
      }
    };
    loadQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const today = new Date().getDate();
      const dailyQuote = quotes[today % quotes.length];
      setQuote(dailyQuote);
    }
  }, [quotes]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const randomQuote = () => {
    const select = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(select);
  };

  const generateCustomQuote = () => {
    const customQuoteText = prompt("Enter your quote:");
    const customQuoteAuthor = prompt("Enter the author:");
    if (customQuoteText && customQuoteAuthor) {
      setCustomQuote({ text: customQuoteText, author: customQuoteAuthor });
    }
  };

  const addFavorite = (quote: Quote) => {
    setFavorites([...favorites, quote]);
    Swal.fire({
      title: 'Added to Favorites!',
      text: 'This quote has been added to your favorites.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
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

  const editFavorite = (index: number) => {
    const newQuoteText = prompt("Edit your quote:", favorites[index].text);
    const newQuoteAuthor = prompt("Edit the author:", favorites[index].author);
    if (newQuoteText && newQuoteAuthor) {
      const updatedFavorites = [...favorites];
      updatedFavorites[index] = { text: newQuoteText, author: newQuoteAuthor };
      setFavorites(updatedFavorites);
      Swal.fire({
        title: 'Updated!',
        text: 'Quote updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container'>
      <h2>Quote of the Day</h2>
      <p>{quote.text}</p>
      <p>{quote.author}</p>
      <button onClick={randomQuote}>New Quote</button>
      <button onClick={() => addFavorite(quote)}>Add to Favorites</button>

      <h2>Custom Quote Generator</h2>
      <p>{customQuote.text}</p>
      <p>{customQuote.author}</p>
      <button onClick={generateCustomQuote}>Generate Custom Quote</button>
      <button onClick={() => addFavorite(customQuote)}>Add to Favorites</button>

      <div>
        <h3>Favorites</h3>
        <ul>
          {favorites.map((fav, index) => (
            <li key={index}>
              {fav.text} - {fav.author}
              <button onClick={() => editFavorite(index)}>Edit</button>
              <button onClick={() => deleteFavorite(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
