import Routes from "./routes";
import GlobalStyles from "./styles/global";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./hooks/useCart";
import { Header } from "./components/Header";

const App = (): JSX.Element => {
	return (
		<BrowserRouter>
			<CartProvider>
				<GlobalStyles />
				<Header />
				<Routes />
				<ToastContainer autoClose={3000} />
			</CartProvider>
		</BrowserRouter>
	);
};

export default App;
