import React, {Component} from "react"
import "./shopping.css"
import Viewitems from "../../components/viewitems/viewitems"
import Cartitems from "../../components/cartitems/cartitems"
import Viewmodal from "./viewmodal"
import cart from "../../shopping-cart.png"


class Shopping extends Component {

    // still need to integrate unique id for cart feature

    // modalItemId and addingItemAmount are used together when adding to cart
    state = {
        inventory: [
            {id: "001", name: "Bohomian Bed Frame", description: "Simple bed latform made from walnut wood and finished in Bohemian style.", 
            amount: 20, price: 1.99, image: ["bed01-1.jpg", "bed01-2.jpg"]},
            {id: "002", name: "Glasstop Work Desk", description: "Minimalistic desk toppped with high quality glass.", 
            amount: 5, price: 2.99, image: ["desk01-1.jpg","desk01-2.jpg"]},
            {id: "003", name: "Rustic Contemporary Dresser", description: "Made from ashwood, drawers are lined white felt for an embellished look.", 
            amount: 3, price: 5, image: ["dresser01-1.jpg","dresser01-2.jpg"]},
            {id: "004", name: "Sphere Floor Lamp", description: "Simple and elegant featuring sturdy bottom from beech wood and brass stand.", 
            amount: 5, price: 5.25, image: ["lamp01-1.jpg","lamp01-2.jpg"]},
            {id: "005", name: "Tall Side Table", description: "Inspired by folk design, perfect as an accent piece.", 
            amount: 5, price: 3, image: ["side01-1.jpg","side01-2.jpg"]},
            {id: "006", name: "Rattan Lounge Chair", description: "Crafted from sustainable wood, adds leisure and brightens up any space.", 
            amount: 1, price: 15, image: ["chair01-1.jpg","chair01-2.jpg"]},
            {id: "007", name: "Glasstop Coffee Table", description: "Adds a minimalistic, modern feel to your space. Steel frame in brass finish, tempered glass top.",
            amount: 5, price: 15, image: ["side02-1.jpg","side02-2.jpg"]},
            {id: "008", name: "Hanging Basket Shelf", description: "Three concentric shelves netted with wood and cotton.",
            amount: 10, price: 20, image: ["shelf02-1.jpg","shelf02-2.jpg"]},
            {id: "009", name: "Three Tier Shelf", description: "",
            amount: 5, price: 15, image: ["shelf01-1.jpg","shelf01-2.jpg"]},
            {id: "010", name: "Rattan Floor Mirror", description: "Rattan and iron mirror with basket for storage.",
            amount: 5, price: 15, image: ["mirror01-1.jpg","mirror01-2.jpg"]},
            {id: "011", name: "Bedside Light", description: "Simple yet glamorous. Iron and linen-mix.",
            amount: 5, price: 10, image: ["lamp02-1.jpg","lamp02-2.jpg"]},
            {id: "012", name: "Plush Armchair", description: "",
            amount: 6, price: 10, image: ["chair02-1.jpg","chair02-2.jpg"]},
            {id: "013", name: "", description: "",
            amount: 1, price: 2, image: ["bed02-1.jpg","bed02-2.jpg"]},
            {id: "014", name: "", description: "",
            amount: 2, price: 2, image: ["plant01-1.jpg","plant01-2.jpg"]},
            {id: "015", name: "Round Glasstop Table", description: "Round glasstop with crossing metal legs.",
            amount: 2, price: 2, image: ["side03-1.jpg","side03-2.jpg"]},
            {id: "016", name: "Long Sofa", description: "Deep cushioning for comfortable slouching, linen cover, oak legs.",
            amount: 2, price: 3, image: ["sofa01-1.jpg","sofa01-2.jpg"]}
        ],
        showModal: false,
        showCart: false,
        modalItemId: "",
        addingItemAmount: 0,
        cart: [],
    }

    handleViewPopup = (itemId) => {
        this.setState({showModal: true, modalItemId: itemId});
        console.log("handleViewPopup was called")
    }

    // bind function to close button of modal, or when clicked outside
    closeViewPopup = () => {
        this.setState({showModal: false});
    }

    addingToCart = (event) => {
        this.setState({addingItemAmount: event.target.value});
        event.preventDefault();
    }

    submitToCart = (event) => {
        this.setState({cart: [...this.state.cart, {id: this.state.modalItemId, amount: this.state.addingItemAmount}]});
        this.closeViewPopup();
        event.preventDefault();
        console.log(this.state.cart);
    }

    viewCart = () => {
        // also check if cart is non-empty
        // if cart empty, show alert message
        this.setState({showCart: true});
    }

    closeCart = () => {
        this.setState({showCart: false});
    }

    render() {

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
                    name={this.state.inventory[this.state.modalItemId].name}
                    description={this.state.inventory[this.state.modalItemId].description}
                    amount={this.state.inventory[this.state.modalItemId].amount}
                    price={this.state.inventory[this.state.modalItemId].price}
                    image={this.state.inventory[this.state.modalItemId].image}
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
                    ></Cartitems>
                </div>
                :null}


                <div className="itemcontainer">
                    {this.state.inventory.map( (item,index) => {
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