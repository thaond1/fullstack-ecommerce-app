import React from "react"
import "./thankyou.css"

const Thankyou = (props) => {
    return (
        <div className="fullmodal">
            <div className="center">
                <h2> Thank you, {props.name}! </h2>
                <p> We sent you a receipt confirmation email at {props.email}. </p>
                <p> We are glad you found what you're looking for. </p>
                <p> Customer satisfaction is our #1 priority, please let us know if your shopping experience was anything short of excellent.</p>
            </div>
        </div>
    )
}

export default Thankyou;