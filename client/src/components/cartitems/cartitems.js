import React from "react"
import "./cartitems.css"
// Use a state to maintain item amount when incr/decr with buttons
// Then when button clicked, update state here and also call decrementCart/incrementCart functions in shopping.js


const cartitem = (props) => {
    console.log(props.cart);
    var total = 0;

    return (
        <div className="cartmodal">
            <div className="cartspace">
                <div className="closespan">
                    <button className="closebutton" onClick={props.closecart}> &times; </button>
                </div>
                <p> Cart </p>
                {props.cart.map( item => {
                    const itemProperties = props.inventory[item.id];
                    total = total + parseFloat(itemProperties.price)*parseInt(item.amount)
                    return (
                        <div className="cartitem">
                            <div className="leftcol">
                                <img src={require(`../../assets/${itemProperties.image[0]}`)}/>
                            </div>
                            <div className="rightcol">
                                <p> {itemProperties.name} </p>
                                <p> {itemProperties.description} </p>
                                <p> Price: ${(itemProperties.price).toFixed(2)} </p>
                                <p> Amount: {item.amount} </p>
                                <button className="increment" onClick={() => {props.increment(item.id)}}>&#43;</button>
                                <button className="decrement" onClick={() => {props.decrement(item.id)}}>&minus;</button>
                            </div>
                        </div>
                        
                    )
                } )}
                <p> Total: ${total.toFixed(2)} </p>
                <button className="checkout">Checkout</button>
            </div>
        </div>
    )
}

export default cartitem
// 