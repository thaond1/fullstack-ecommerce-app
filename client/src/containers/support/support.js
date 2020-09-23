import React from "react"
import "./support.css"

const Support = () => {
    return (
        <div>
            <div className="contact">
                <div className="section">
                    <p>Contact Us</p>
                </div>
                <div className="info">
                    <p className="left">Email</p>
                    <p className="right">customersupport@interior.com</p>
                    <p className="left">Phone</p>
                    <p className="right">1 (800) 888-8888</p>
                    <p className="left">Office</p>
                    <p className="right">510 E Peltason Dr. Irvine, California 92697</p>
                </div>
            </div>
            <br></br>
            <div className="shipping">
                <div className="section"> 
                    <p>Shipping</p>
                </div>
                <table className="shippingtable">
                    <tr>
                        <th className="tri1">Method</th>
                        <th className="tri2">Arrival</th>
                        <th className="tri3">Cost</th>
                    </tr>
                    <tr>
                        <td className="tri1">Standard</td>
                        <td className="tri2">10-15 business days</td>
                        <td className="tri3">$9.99</td>
                    </tr>
                    <tr>
                        <td className="tri1">Express</td>
                        <td className="tri2">7-10 business days</td>
                        <td className="tri3">$21.34</td>
                    </tr>
                    <tr>
                        <td className="tri1">Rush</td>
                        <td className="tri2">5 business days</td>
                        <td className="tri3">$30.55</td>
                    </tr>
                </table>
            </div>
            <div className="policies">
                <div className="section">
                    <p>Policies</p>
                </div>
                <div className="info">
                    <p> Can I cancel my order?</p>
                    <p> After placing your order, you can cancel it during a 2 day window. Please contact customer support for help. Otherwise, you can return your order for free.</p>
                    <p> How do I return my order?</p>
                    <p> There is a sticker provided with each order for return, postage is already paid for. Please drop the package off at your local post office and send a return request email to customer support.</p>
                </div>
            </div>
        </div>
    )
}

export default Support;