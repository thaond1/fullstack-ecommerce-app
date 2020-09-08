import React, {useState} from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';
import './CheckoutForm.css'

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutState, setCheckoutState] = useState({
    firstname: '', lastname: '', address: '', city: '', zip: '', state: '', email: '', cardname: ''
  })
  var total = 0

  const setFirstName = (event) => {
    setCheckoutState({...checkoutState, firstname: event.target.value})
  }

  const setLastName = (event) => {
    setCheckoutState({...checkoutState, lastname: event.target.value})
  }
  const setAddress = (event) => {
    setCheckoutState({...checkoutState, address: event.target.value})
  }
  const setCity = (event) => {
    setCheckoutState({...checkoutState, city: event.target.value})
  }
  const setZip = (event) => {
    setCheckoutState({...checkoutState, zip: event.target.value})
  }
  const setState = (event) => {
    setCheckoutState({...checkoutState, state: event.target.value})
  }
  const setEmail = (event) => {
    setCheckoutState({...checkoutState, email: event.target.value})
  }

  const setCardName = (event) => {
    setCheckoutState({...checkoutState, cardname: event.target.value})
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    const result = await stripe.confirmCardPayment(props.clientsecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: checkoutState.cardname
        }
      },
      shipping: {
        name: checkoutState.firstname + " " + checkoutState.lastname,
        address: {
          line1: checkoutState.address,
          city: checkoutState.city,
          postal_code: checkoutState.postal,
          state: checkoutState.state,
          country: 'US'
        }
      },
      receipt_email: checkoutState.email
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        props.redirect()
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="leftdiv">
        <div className="shipping">
          <p className="shippingtext"> Shipping </p>
          <div className="halfinputdiv">
            <label className="label"> First Name</label>
            <input type="text" className="input" onChange={(event) => setFirstName(event)}></input>
          </div>
          <div className="halfinputdiv">
            <label className="label"> Last Name </label>
            <input type="text" className="input" onChange={(event) => setLastName(event)}></input>
          </div>
          <div className="wholeinputdiv">
            <label className="label"> Street Address </label>
            <input type="text" className="input" onChange={(event) => setAddress(event)}></input>
          </div>
          <div className="halfinputdiv">
            <label className="label"> City </label>
            <input type="text" className="input" onChange={(event) => setCity(event)}></input>
          </div>
          <div className="halfinputdiv">
            <label className="label"> ZIP Code </label>
            <input type="text" className="input" onChange={(event) => setZip(event)}></input>
          </div>
          <div className="halfinputdiv">
            <label className="label"> State </label>
            <input type="text" className="input" onChange={(event) => setState(event)}></input>
          </div>
          <div className="wholeinputdiv">
            <label className="label"> Email </label>
            <input type="email" className="input" onChange={(event) => setEmail(event)}></input>
          </div>
        </div>

        <div className="payment">
          <p className="paymenttext"> Payment </p>
          <div className="wholeinputdiv">
            <label className="label"> Name on Card </label>
            <input type="text" className="input" onChange={(event) => setCardName(event)}></input>
          </div>
          <CardSection/>
          <button className="paybutton" disabled={!stripe}>Pay</button>
        </div>
      </div>

      <div className="rightdiv">
        <p className="carttext"> Cart Summary </p>
        {props.cart.map( i => 
          { const item = props.inventory[i.id]
            total = total + item.price*i.amount
            return <div className="item"> 
                      <p className="cartleftdiv"> {item.name}({i.amount}) </p> 
                      <p className="cartrightdiv"> {(item.price*i.amount).toFixed(2)} </p>
                    </div> })}
        <div className="item">
          <p className="cartleftdiv"> Subtotal </p>
          <p className="cartrightdiv"> ${total.toFixed(2)} </p>
        </div>

        <div className="item">
          <p className="cartleftdiv"> Tax ({props.tax*100}%) </p>
          <p className="cartrightdiv"> ${total*props.tax.toFixed(2)} </p>
        </div>

        <div className="item">
          <p className="cartleftdiv"> Total </p>
          <p className="cartrightdiv"> ${(total + total*props.tax).toFixed(2)} </p>
        </div>
      </div>

    </form>
  );
}

export default CheckoutForm;
