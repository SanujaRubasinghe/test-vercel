import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {LoadScript, Autocomplete} from '@react-google-maps/api'
import API from "../api"
import "./BuyingPage.css";

const libraries = ['places']
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const BuyingPage = () => {

  const navigate = useNavigate()

  const location = useLocation();
  const product = location.state || {};

  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [autocomplete, setAutocomplete] = useState(null)
  const [distance, setDistance] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Sri Lanka",
    city: "",
    streetAddress: "",
    apartment: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
    paymentMethod: "bankTransfer",
    agreeTerms: false,
  });

  const streetAutocompleteRef = useRef(null)

  function buildFullAddress(formData) {
    let addressParts = [];
  
    if (formData.streetAddress) addressParts.push(formData.streetAddress);
    if (formData.apartment) addressParts.push(formData.apartment);
    if (formData.city) addressParts.push(formData.city);
    if (formData.postcode) addressParts.push(formData.postcode);
    if (formData.country) addressParts.push(formData.country);
  
    return addressParts.join(', ');
  }

  const handleStreetPlaceChanged = () => {
    const place = streetAutocompleteRef.current.getPlace()
    if (!place.address_components) return

    const address = {
      streetAddress: '',
      city: '',
      country: '',
      postcode: '',
    }

    place.address_components.forEach(component => {
      const types = component.types

      if (types.includes('street_number')) {
        address.streetAddress = component.long_name + ' ' + address.streetAddress;
      }
      if (types.includes('route')) {
        address.streetAddress += component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.postcode = component.long_name;
      }
      if (types.includes('country')) {
        address.country = component.long_name;
      }
    })

    setFormData(prev => ({
      ...prev,
      streetAddress: address.streetAddress,
      city: address.city || prev.city,
      country: address.country || prev.country,
      postcode: address.postcode || prev.postcode,
    }));
  }

  useEffect(() => {
    if (!formData.streetAddress) return
    const handleCalculate = async () => {
      try {
        const userAddress = buildFullAddress(formData)
        const response = await API.post('/location/delivery-charges', {
          userAddress: userAddress
        })
  
        setDeliveryCharge(response.data.shippingCost)
        setDistance(response.data.distanceInKm)
        console.log(distance)
        setErrorMessage('')
      } catch (error) {
        console.error(error)
        setErrorMessage('Failed to calculate shipping. Please check the address.')
      }
    }
    handleCalculate()
  }, [formData.streetAddress])


  const sendMessage = async (number, text) => {
    try {
      const response = await API.post("/messages/send-message", {
        to: number,
        message: text
      })
      console.log("Message sent: ", response.data)
    } catch (err) {
      console.error("Failed to send message: ", err.response.data)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    } else {
      try {
        const order = `Product: ${product.productName}.\nProduct quantity: ${product.quantity}\nCustomer Name: ${formData.firstName} ${formData.lastName}\nPhone number: ${formData.phone}`
                       
        const res = await API.post("/products/purchase", formData)
        sendMessage('asdfsd',order)
        alert(res.data.message)
        navigate('/products')
      } catch(err) {
        console.error(err)
      }
    }
    
  };

  const subtotal = product.productPrice * product.quantity;
  const shippingCost = deliveryCharge
  const total = subtotal + (shippingCost * 1)

  return (
    <div className="buying-page">
    <LoadScript googleMapsApiKey='AIzaSyANZfEI3ADTKjUBTpQ_QB9ToxsV-i1J6v8' libraries={libraries}>
      <form className="billing-details" onSubmit={handleSubmit}>
        <h2>Billing Details</h2>
        <div className="form-group">
          <input type="text" name="firstName" placeholder="First name *" required onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last name *" required onChange={handleChange} />
        </div>
        <input type="text" name="companyName" placeholder="Company name (optional)" onChange={handleChange} />

        <Autocomplete 
          onLoad={(autoC) => (streetAutocompleteRef.current = autoC)}
          onPlaceChanged={handleStreetPlaceChanged}
          options={{
            types: ['address'],
            componentRestrictions: {country: 'lk'},
          }}
        >
          <input type="text" name="streetAddress" placeholder="Street address *" required onChange={handleChange} />
        </Autocomplete>
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" onChange={handleChange} />
        <input type="text" name="postcode" placeholder="Postcode / ZIP (optional)" value={formData.postcode} onChange={handleChange} />
        <input type="text" name="country" value="Sri Lanka" readOnly />
        <input type="tel" name="phone" placeholder="Phone *" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email address *" required onChange={handleChange} />
        <textarea name="orderNotes" placeholder="Order notes (optional)" onChange={handleChange}></textarea>

        <h2>Your Order</h2>
        <div className="order-summary">
          <p>
            {product.productName} ({product.selectedSize}, {product.selectedColor}) x {product.quantity}
          </p>
          <p>Subtotal: Rs. {subtotal.toLocaleString()}</p>
          <p>Shipping: Rs. {shippingCost.toLocaleString()}</p>
          <p><strong>Total: Rs. {total}</strong></p>
        </div>

        <div className="payment-options">
          <label>
            <input type="radio" name="paymentMethod" value="bankTransfer" checked={formData.paymentMethod === "bankTransfer"} onChange={handleChange} />
            Bank Transfer / QR Code
          </label>
          <label>
            <input type="radio" name="paymentMethod" value="cardPayment" checked={formData.paymentMethod === "cardPayment"} onChange={handleChange} />
            Pay with Visa / MasterCard / AMEX
          </label>
        </div>

        <label className="terms">
          <input type="checkbox" name="agreeTerms" onChange={handleChange} />
          I have read and agree to the website Terms and Conditions *
        </label>
        
        <button type="submit" onClick={handleSubmit}>Place Order</button>
      </form>
    </LoadScript>
    </div>
  );
};

export default BuyingPage;
