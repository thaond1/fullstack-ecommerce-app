import React, {useState} from "react"
import "./viewitems.css"

const Viewitem = (props) => {
    const [buttonState, setButtonState] = useState({
        showViewButton: false
    })

    const showButton = () => {
        setButtonState({showViewButton: true});
    }

    const hideButton = () => {
        setButtonState({showViewButton: false});
    }

    return (
        <div onMouseEnter={showButton} onMouseLeave={hideButton} className='card'> 
            <p className="name"> {props.name} </p>
            <div className="imagebox">
                <img className="image" src={require(`../../assets/${props.image}`)}></img>
                
            </div>
            {   buttonState.showViewButton?
                <button className="viewbutton" onClick={props.quickview}> View Item </button>
                : null
                }
            <p className="description"> {props.description}</p>
            <div className="bottomspan">
                <h4 className="price"> ${(props.price).toFixed(2)} </h4>
                <p className="amount"> {props.amount} in stock </p>
            </div>
            
        </div>
    )
}

export default Viewitem;