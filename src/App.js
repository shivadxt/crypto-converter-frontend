import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Converter = () => {
  const [sourceCryptos, setSourceCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://crypto-backend-project-nodejs.vercel.app/top100');
      setSourceCryptos(response.data);
      setError(null);
    } catch (error) {
      setError('Fetching cryptocurrencies failed. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConversion = async (e) => {
    e.preventDefault();

    if (amount && sourceCryptos.length > 0) {
      try {
        const response = await axios.get(`https://crypto-backend-project-nodejs.vercel.app/convert/${selectedCrypto}/${amount}/${targetCurrency}`);
        setConvertedAmount(response.data.convertedAmount);
        setError(null);
      } catch (error) {
        setError('Error converting currency. Please try again.');
      }
    } else {
      setError('Please enter a valid amount and select a cryptocurrency');
    }
  };

  return (
    <div className='container'>
      <h1>Currency Converter</h1>
      {error && <p className='error-msg'>{error}</p>}
      <form onSubmit={handleConversion} className='form'>
        <div className='form-group'>
          <label htmlFor='selectCrypto'>Select Source Cryptocurrency:</label>
          <select id='selectCrypto' onChange={e => setSelectedCrypto(e.target.value)}>
            {sourceCryptos && sourceCryptos.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
            ))}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='enterAmount'>Enter Amount:</label>
          <input id='enterAmount' type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div className='form-group'>
          <label htmlFor='selectCurrency'>Select Target Currency:</label>
          <select id='selectCurrency' onChange={e => setTargetCurrency(e.target.value)} defaultValue="usd">
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>

        <button type="submit" className='convert-btn'>Convert</button>
      </form>

      {convertedAmount && <p className='converted-amount'>Converted Amount: {convertedAmount}</p>}
    </div>
  );
};

export default Converter;
