import Routes from "./routes";
import GlobalStyles from "./styles/global";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./hooks/useCart";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./services/query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Header } from "./components/Header";

const App = (): JSX.Element => {
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<CartProvider>
					<GlobalStyles />
					<Header />
					<Routes />
					<ToastContainer autoClose={3000} />
				</CartProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</BrowserRouter>
	);
};

export default App;
