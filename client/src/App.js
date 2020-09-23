import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from "react-router-dom"
import Shopping from './containers/shopping/shopping'
import Support from './containers/support/support'
import './App.css';

// Here we will store and manage diffent "pages" for the app
// 1. Shopping page (also home page) with different items which can be quick viewed and added to cart
// 2. Cart page that displays items currently in cart
// 3. Informational page with contact information and shipping policy
// 4. Login page for vendor to post more items -> leads to page that accepts input

// Set up nav bar with links to home and contact

class App extends Component {

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <header className="App-header">
        </header>
        <nav className="navbar">
          <ul>
            <li className="navlink"> <Link to="/" className="link">Shop</Link> </li>
            <li className="navlink"> <Link to="/support" className="link">Support</Link> </li>
          </ul>
        </nav>
        <Route path="/support" exact component={Support}></Route>
        <Route path="/" exact component={Shopping}></Route>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
