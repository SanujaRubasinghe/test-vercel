import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './Components/CartContext';
import Navbar from './Navbar';
import Home from './Components/Home';
import JobSeekers from './Components/JobSeekers';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import ImageDeliver from './Components/ImageDeliver';
import BrandContainer from './Components/BrandContainer';
import Header from './Components/Header';
import Slideshow from './Components/Slideshow';

import ProductList from './Components/ProductList';
import Footer from './Components/Footer';
import ConstructionSupplies from './Components/ConstructionSupplies';
import CategorySection from './Components/CategorySection';
import Subcategories from './Components/SubCategories';
import ProductDisplay from './Components/ProductDisplay';
import FeatureSection from './Components/FeatureSection';
import NewArrivals from './Components/NewArrivals';

import ShoppingCart from './Components/ShoppingCart';
import BuyingPage from './Components/BuyingPage';
import MiniCategory from './Components/MiniCategory';
import AdminPanel from './Components/AdminPage/AdminPanel';
import SubCategoryTable from './Components/AdminPage/SubCategoryTable';
import AdminLayout from './Components/AdminPage/AdminLayout';
import CustomerComplaintsForm from './Components/CustomerComplaintsForm';
import SearchBarN from './Components/SearchBarN';
import Feedback from './Components/Feedback';
import PrivateRoute from './Components/PrivateRoutes';
import UserProfile from './Components/UserProfile';

import LogInPage from './Components/LogInPage';

function App() {
  return (
    <div>
      <Router>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <SearchBarN />
                  <Slideshow />
                  <ImageDeliver />
                  <Home />
                  <ProductList />
                  <BrandContainer />
                  <ConstructionSupplies />
                  <NewArrivals />
                  <FeatureSection />
                  <Footer />
                </>
              }
            />
            <Route path="/products" element={<><ProductList /><FeatureSection /><Footer /></>} />
            <Route path="/about-us" element={<><AboutUs /><SearchBarN /><CustomerComplaintsForm /><Footer /></>} />
            <Route path="/contact-us" element={<><ContactUs /><MiniCategory /><Footer /></>} />
            <Route path="/category" element={<><Feedback /><Footer /></>} />
            <Route path="/product-display" element={<ProductDisplay />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/buying" element={<BuyingPage />} />
            <Route path="/sub-category" element={<Subcategories />} />

            {/* ✅ Fixed Admin Routing */}
            <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />}>
              <Route index element={<AdminPanel />} />
              <Route path="home" element={<SubCategoryTable />} />
              <Route path="category" element={<AdminPanel />} />
              <Route path="subcategory" element={<h2>Category Page</h2>} />
              <Route path="products" element={<h2>Products Page</h2>} />
              <Route path="orders" element={<h2>Orders Page</h2>} />
            </Route>

            <Route path='/login' element={<LogInPage />}/>
            <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
            
            {/* Public Route for MiniCategory */}
            <Route path="/mini-category/:subcategory" element={<MiniCategory />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
