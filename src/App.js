import {useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Converter = () => {
  const [sourceCryptos, setSourceCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [error, setError] = useState(null);

  const fetchData = () => {
    
    const backendURL = 'https://crypto-backend-project-nodejs.vercel.app/top100'; 
    
    axios.get(backendURL)
      .then(response => {
        setSourceCryptos(response.data);
        setError(null);
      })
      .catch(error => {
        setError('Wait we are fetching cryptocurrencies it will take some time :) ');
      });
  };


  useEffect(() => {
    fetchData();
  }, []); 

  const handleConversion = () => {
    if (amount && sourceCryptos.length > 0) {
  
      axios.get(`https://crypto-backend-project-nodejs.vercel.app/convert/${selectedCrypto}/${amount}/${targetCurrency}`)
        .then(response => {
          setConvertedAmount(response.data.convertedAmount);
          setError(null);
        })
        .catch(error => {
          setError('Error converting currency');
        });
    } else {
      setError('Please enter valid amount and select a cryptocurrency');
    }
  };

  return (
    <div className='container'>
      <h1>Currency Converter</h1>
      {error && <p>Error: {error}</p>}
      <form onSubmit={e => { e.preventDefault(); handleConversion(); }}>
      <div style={{paddingBottom:"1rem"}}>
      <label>
          Select Source Cryptocurrency:
          <select onChange={e => setSelectedCrypto(e.target.value)}>
            {sourceCryptos&&sourceCryptos?.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
            
            ))}
          </select>
        </label>
        </div>
        <br />
        <div style={{paddingBottom:"1rem"}}>
        <label>
          Enter Amount:
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>
        </div>
        <br/>
        <div style={{paddingBottom:"1rem"}}>
        <label>
          Select Target Currency:
          <select onChange={e => setTargetCurrency(e.target.value)} defaultValue="usd">
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </label>
        </div>
        <br />
        <button type="submit">Convert</button>
      </form>
      {convertedAmount && <p>Converted Amount: {convertedAmount}</p>}
    </div>
  );
};

export default Converter;
