import React from 'react';
import './Price.css';

const PriceBook = () => {
  return (
    <div className='pricebook-container'>
      <div className='subheading'><h1>New price book</h1></div>
      <div className="price-box">
        <div className="price-box-heading">
          <h2 className='h2'>Details</h2>
        </div>
        <div className="price-box-content">
          <div className="content-left">
            <div className='input-row'>
              <label>Name</label>
              <input type="text" name="" className="wide" />
            </div>
            <div className='input-row'>
              <label>Customer group</label>
              <input type="text" name="" className="wide" />
            </div>
            <div className='input-row'>
              <label>Outlet</label>
              <input type="text" name="" className="wide" />
            </div>
          </div>
          <div className="content-right">
            <div className='input-row'>
              <label>Valid from</label>
              <input type="text" name="" className="wide" />
            </div>
            <div className='input-row'>
              <label>Valid to</label>
              <input type="text" name="" className="wide" />
            </div>
            <hr />
            <div className="csv-file-import hidden-in-embedded-app">
              <div className="input-row line">
                <label for="vend_price_book_price_book_file">Price book file</label>
                <input type="file" name="" className="wide" />
              </div>
            </div>
          </div>
        </div>
        <div className="form-button-bar">
          <button className="btn btn--primary unit-right">Save Price Book</button>
          <a href="/price_book" className="btn unit-right">Cancel</a>
        </div>
      </div>
    </div>
  )
}

export default PriceBook