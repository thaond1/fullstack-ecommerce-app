import React, { Component } from 'react';
import Shopping from './containers/shopping/shopping'
import './App.css';

// Here we will store and manage diffent "pages" for the app
// 1. Shopping page (also home page) with different items which can be quick viewed and added to cart
// 2. Cart page that displays items currently in cart
// 3. Login page for vendor to post more items -> leads to page that accepts input

// Make the shopping cart icon on a horizontal span that floats on the page
// Make the cart page (popup) => Components:
// 1. Items with price, name, picture, amount, subtotal (nice to have: can incr/decr item amount)
// 2. Total price
// 3. Checkout button


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Interior Design Shop</h1>
        </header>
        
        <Shopping></Shopping>
      </div>
    );
  }
}

export default App;
