import React, {useState} from "react"
import "./viewmodal.css"

                    

const viewmodal = (props) => {
    // modal needs to be clicked outside only to close
    const [imageState, setImageState] = useState({
        image: 0,
    })

    return (
        <div className="modalbox">
            <div className="modalcontent">
                <div className="closespan">
                    <button className="closebutton" onClick={props.closemodal}> &times; </button>
                </div>
                <div className="leftcolumn">
                    <img className="image" src={require(`../../assets/${props.image[imageState.image]}`)}/>
                    <div className="dotbox">
                        <button className="dot" onClick={() => {setImageState({image:0})}}></button>
                        <button className="dot" onClick={() => {setImageState({image:1})}}></button>
                    </div>
                </div>
            
                <div className="rightcolumn">
                <h5> {props.name} </h5>
                    <p> {props.description} </p>
                    <div>
                        <p> ${props.price} </p>
                        <p> {props.amount} in stock </p>
                    </div>
                    <form onSubmit={(event) => props.submitcart(event)}>
                        <input type="number" min="1" max={props.amount} onChange={(event) => props.addtocart(event)}/>
                        <button type="submit"> Add to Cart </button>
                    </form>
                    
                </div>
            </div>
        </div>

    );
}

export default viewmodal;