import React, {Component} from "react"
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from '../checkout/CheckoutForm';
import "./shopping.css"
import Viewitems from "../../components/viewitems/viewitems"
import Cartitems from "../../components/cartitems/cartitems"
import Viewmodal from "./viewmodal"
import cart from "../../shopping-cart.png"

/*
    Important Note: cart contains {id, amount} where id is 
    the index of the corresponding inventory item
*/

const stripePromise = loadStripe("pk_test_51HMbwoHlAknTTFclFX9flu2gFYw5F6M3EA0wjLso2UQX3tCRJnqnTadcX3tJ9F7aAn7W6nmTjl1EtU3ck6J30LjN00mplj1f3s");
var myStorage = window.sessionStorage;

class Shopping extends Component {
    // modalItemId and addingItemAmount are used together when adding to cart
    constructor() {
        super();
        this.state = {
            inventory: [],
            showModal: false,
            showCart: false,
            onCheckout: false,
            modalItemId: "",
            addingItemAmount: 0,
            cart: [],
            filter: "all",
            clientSecret: undefined,
            taxPercent: 0,      // returned from server side
        }
    }

    componentDidMount() {
        fetch('/inventory')
            .then(res => res.json())
            .then(myinventory => this.setState({inventory: myinventory}))
        if (myStorage.currentCart !== undefined) {
            this.setState({cart: JSON.parse(myStorage.currentCart)})
        }
        
    }

    handleViewPopup = (itemId) => {
        this.setState({showModal: true, modalItemId: itemId});
    }

    closeViewPopup = () => {
        this.setState({showModal: false});
    }

    addingToCart = (event) => {
        this.setState({addingItemAmount: event.target.value});
        event.preventDefault();
    }

    submitToCart = (event) => {
        var index = this.state.modalItemId
        if (this.state.filter !== "all") {  // filtered, need to find actual index in inventory from this.state.modalItemId
            var filtered = this.state.inventory.filter( item => item.category === this.state.filter)
            var itemToAdd = filtered[this.state.modalItemId]
            index = this.state.inventory.findIndex(i => i==itemToAdd)
        }
        var itemInCart = this.state.cart.find(i => i.id === index)

        if (itemInCart === undefined) {      // item not yet in cart
            
            this.setState({cart: [...this.state.cart, {id: index, amount: parseInt(this.state.addingItemAmount)}]},
            () => {this.closeViewPopup();
                event.persist();
                myStorage.setItem('currentCart', JSON.stringify(this.state.cart));})
        }
        else {                              // item already in cart, adding more
            var currentAmount = itemInCart.amount;
            var inventoryAmount = parseInt(this.state.inventory[index].amount)    // modalItemId is index of inventory list
            var cartIndex = this.state.cart.findIndex( i => i.id===index )
            var newCart = [...this.state.cart]
            window.alert("in else")
            if ((currentAmount+parseInt(this.state.addingItemAmount)) > inventoryAmount) {  // if exceeding max amount in stock
                newCart[cartIndex].amount = inventoryAmount;    // add maximum amount to cart instead
                this.setState({cart: newCart},
                    () => {this.closeViewPopup();
                        event.persist();
                        window.alert("Amount exceeds items in stock. Adding all items in inventory.");
                        myStorage.setItem('currentCart', JSON.stringify(this.state.cart));});
            }
            else {                          // not exceeding max amount in stock, sum up two amounts
                newCart[cartIndex].amount = parseInt(this.state.addingItemAmount)+currentAmount
                this.setState({cart: newCart},
                    () => {this.closeViewPopup();
                        event.persist();
                        myStorage.setItem('currentCart', JSON.stringify(this.state.cart));});
            }
        }
    }

    viewCart = () => {
        // also check if cart is non-empty
        // if cart empty, show alert message
        if (this.state.cart.length > 0) {
            this.setState({showCart: true});
        }
        else {
            window.alert("Your cart is currently empty.")
        }
    }

    closeCart = () => {
        this.setState({showCart: false});
    }

    checkout = () => {
        // make call to fetch /checkout
        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({myCart: this.state.cart}) // not passing money amount for security reasons
        })
            .then(res => res.json())
            .then(responseJson => {this.setState({clientSecret: responseJson.client_secret, taxPercent: responseJson.tax_percent})})
        // When server returns with intent, set onCheckout state to show payment modal
        // When user submits card info, call stripe.confirmCardPayment() with the client secret.
        this.setState({onCheckout: true})
    }


    // Note: cartId is index in inventory
    incrementCart = (cartId) => {
        // check if increment will exceed max in stock
        var inventoryIndex = parseInt(cartId);
        var cartAmount = this.state.cart.find( item => item.id === cartId).amount;
        var inventoryAmount = this.state.inventory[inventoryIndex].amount;
        if (cartAmount+1 <= inventoryAmount) {   // no, increment
            var newCart = [...this.state.cart];
            (newCart[this.state.cart.findIndex( item => item.id === cartId)].amount)++;
            this.setState({cart: newCart});
            myStorage.setItem('currentCart', JSON.stringify(newCart));
        }
    }

    decrementCart = (cartId) => {
        // check if decrement will delete item
        var cartAmount = this.state.cart.find( item => item.id === cartId).amount;
        var newCart = [...this.state.cart];
        if (cartAmount-1 > 0) {     // no, decrement
            (newCart[this.state.cart.findIndex( item => item.id === cartId)].amount)--;
            this.setState({cart: newCart});
            myStorage.setItem('currentCart', JSON.stringify(newCart));
        }
        else {              // remove from cart
            newCart.splice(this.state.cart.findIndex( item => item.id === cartId), 1);
            this.setState({cart: newCart});
            myStorage.setItem('currentCart', JSON.stringify(newCart));
        }
    }

    redirectToHome = () => {
        this.setState({onCheckout: false, clientSecret: undefined, taxPercent: 0, showCart: false, cart: []})
    }

    render() {
        let filteredList = this.state.inventory;
        if (this.state.filter !== "all") {
            filteredList = this.state.inventory.filter( item => item.category === this.state.filter)
        }
        // using index to locate item to be displayed but can be changed (bind(this,item.index)=>item.id)
        return (

            // USE STATE OF ONCHECKOUT HERE: IF TRUE, DISPLAY CHECKOUT COMPONENT, ELSE DISPLAYS APP
            <div>
                {(this.state.onCheckout)?
                    <div className="checkoutmodal">
                    {/* displays money amount, place to provided card information, address, etc.
                        will use the checkout container here, when done remember to reset clientsecret*/}
                    <Elements stripe={stripePromise}>
                        <CheckoutForm clientsecret={this.state.clientSecret}
                        cart={this.state.cart}
                        inventory={this.state.inventory}
                        tax={this.state.taxPercent}
                        redirect={this.redirectToHome}/>
                    </Elements>
                    </div>
                :
                <div>
                    <div>
                    <img className="shoppingcart" onClick={this.viewCart} src={cart}/> 
                    {   (this.state.cart.length > 0)?
                        <div className="itemamount"> {this.state.cart.reduce( (cart,item) => cart+ parseInt(item.amount), 0)} </div>
                        :null
                    }
                    </div>
                    {(this.state.showModal)?
                    <div>
                        <Viewmodal
                        name={filteredList[this.state.modalItemId].name}
                        description={filteredList[this.state.modalItemId].description}
                        amount={filteredList[this.state.modalItemId].amount}
                        price={filteredList[this.state.modalItemId].price}
                        image={filteredList[this.state.modalItemId].image}
                        closemodal={this.closeViewPopup}
                        addtocart={this.addingToCart}
                        submitcart={this.submitToCart}
                        ></Viewmodal>
                    </div>: null}

                    {(this.state.showCart)?
                    <div>
                        <Cartitems
                        inventory={this.state.inventory}
                        cart={this.state.cart}
                        closecart={this.closeCart}
                        increment={this.incrementCart}
                        decrement={this.decrementCart}
                        checkout={this.checkout}>
                        </Cartitems>
                    </div>
                    :null}

                    <div className="categories">
                        <button className="filterbutton" onClick={() => this.setState({filter:"all"})}>All</button>
                        <button className="filterbutton" onClick={() => this.setState({filter:"living"})}>Living</button>
                        <button className="filterbutton" onClick={() => this.setState({filter:"bedroom"})}>Bedroom</button>
                        <button className="filterbutton" onClick={() => this.setState({filter:"storage"})}>Storage</button>
                        <button className="filterbutton" onClick={() => this.setState({filter:"lighting"})}>Lighting</button>
                    </div>

                    <div className="itemcontainer">
                        {filteredList.map( (item,index) => {
                            return <Viewitems 
                            name={item.name}
                            description={item.description}
                            amount={item.amount}
                            price={item.price}
                            image={item.image[0]}
                            key={item.id}
                            quickview={this.handleViewPopup.bind(this,index)}>
                            </Viewitems>
                        })} 
                    </div>
                </div>
                }
            </div>
            
        );
    }
}

export default Shopping;