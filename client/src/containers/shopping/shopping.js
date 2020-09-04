import React, {Component} from "react"
import "./shopping.css"
import Viewitems from "../../components/viewitems/viewitems"
import Cartitems from "../../components/cartitems/cartitems"
import Viewmodal from "./viewmodal"
import cart from "../../shopping-cart.png"

/*
    Important Note: cart contains {id, amount} where id is 
    the index of the corresponding inventory item
*/


class Shopping extends Component {
    // modalItemId and addingItemAmount are used together when adding to cart
    constructor() {
        super();
        this.state = {
            inventory: [],
            showModal: false,
            showCart: false,
            modalItemId: "",
            addingItemAmount: 0,
            cart: [],
            filter: "all"
        }
    }

    componentDidMount() {
        fetch('/inventory')
            .then(res => res.json())
            .then(myinventory => this.setState({inventory: myinventory}))
    }

    handleViewPopup = (itemId) => {
        this.setState({showModal: true, modalItemId: itemId}, ()=>{console.log(itemId)});
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
                console.log(this.state.cart);})
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
                        console.log(this.state.cart);});
            }
            else {                          // not exceeding max amount in stock, sum up two amounts
                newCart[cartIndex].amount = parseInt(this.state.addingItemAmount)+currentAmount
                this.setState({cart: newCart},
                    () => {this.closeViewPopup();
                        event.persist();
                        console.log(this.state.cart);});
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

    // CHECK INCREMENT AND DECREMENT FUNCTIONS

    // Note: cartId is index in inventory
    incrementCart = (cartId) => {
        console.log("Inside incrementCart function");
        // check if increment will exceed max in stock
        var inventoryIndex = parseInt(cartId);
        var cartAmount = this.state.cart.find( item => item.id === cartId).amount;
        var inventoryAmount = this.state.inventory[inventoryIndex].amount;
        if (cartAmount+1 <= inventoryAmount) {   // no, increment
            var newCart = [...this.state.cart];
            (newCart[this.state.cart.findIndex( item => item.id === cartId)].amount)++;
            this.setState({cart: newCart});
        }
    }

    decrementCart = (cartId) => {
        console.log("Inside decrementCart function");
        // check if decrement will delete item
        var cartAmount = this.state.cart.find( item => item.id === cartId).amount;
        var newCart = [...this.state.cart];
        if (cartAmount-1 > 0) {     // no, decrement
            (newCart[this.state.cart.findIndex( item => item.id === cartId)].amount)--;
            this.setState({cart: newCart});
        }
        else {              // remove from cart
            newCart.splice(this.state.cart.findIndex( item => item.id === cartId), 1);
            this.setState({cart: newCart});
        }
    }


    render() {
        let filteredList = this.state.inventory;
        if (this.state.filter !== "all") {
            filteredList = this.state.inventory.filter( item => item.category === this.state.filter)
        }

        // using index to locate item to be displayed but can be changed (bind(this,item.index)=>item.id)
        return (
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
                    decrement={this.decrementCart}>
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
            
        );
    }
}

export default Shopping;