// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Components

import BootSequence from "./pages/BootSequence";
import ProductCard from "./components/ProductCard";
import TunePassword from "./components/TunePassword";
import HeaderFlag from "./components/HeaderFlag";
import SingleProductImage from "./components/SingleProductImage";
import SingleProductView from "./pages/SingleProductView";
import Navbar from "./components/Navbar";

// Import Pages
import ProductsPage from "./pages/Products";
import SubmitProduct from "./pages/SubmitProduct";
import UserConsolePage from "./pages/UserConsolePage";
import AdminConsolePage from "./pages/AdminConsolePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import Homepage from "./pages/Homepage";
import EditProduct from "./pages/EditProduct";

import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";

// Import Browser Router stuff...
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Footer from "./components/Footer";

// I added this becuase everytime i navigated to a page from home it too my to the bottom of the page for some reason T-T
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./components/ToastContext";

function App() {
	return (
		<>
			<BrowserRouter>
			<ToastProvider>
			<ScrollToTop/>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/browse" element={<ProductsPage />} />
					<Route path="/sell" element={<SubmitProduct />} />
					<Route path="/sell/:id" element={<EditProduct />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/edit/:id" element={<EditProduct />} />

					{/* Single Product overview page route */}
					<Route path="/product/:id" element={<SingleProductView />}></Route>

					{/* route for switching tabs on admin console page */}
					<Route path="/admin/*" element={<AdminConsolePage />} />
					<Route path="/account" element={<UserConsolePage />} />

					{/* routes for panel switching on login and sign up page */}
					<Route path="/login" element={<LoginPage />}>
						<Route index element={<LoginForm />} />
						<Route path="signup" element={<SignUpForm />} />
					</Route>
				</Routes>
				<Footer></Footer>
				</ToastProvider>
			</BrowserRouter>
		</>
	);
}

export default App;
