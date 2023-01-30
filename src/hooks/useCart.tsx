import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
	children: ReactNode;
}

interface UpdateProductAmount {
	productId: number;
	amount: number;
}

interface CartContextData {
	cart: Product[];
	addProduct: (productId: number) => Promise<void>;
	removeProduct: (productId: number) => void;
	updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
	const [cart, setCart] = useState<Product[]>(() => {
		const storagedCart = localStorage.getItem("@RocketShoes:cart");

		if (storagedCart) {
			return JSON.parse(storagedCart);
		}

		return [];
	});

	const newCart = [...cart];

	const addProduct = async (productId: number) => {
		let productStock = 0;

		try {
			const { data: StockInfo } = await api.get<Stock>(`/stock/${productId}`);

			productStock = StockInfo.amount;
		} catch (error) {
			toast.error("Erro na adição do produto");
			return;
		}

		const productIndex = newCart.findIndex(
			(product) => product.id === productId
		);

		if (productIndex >= 0) {
			const productAmount = newCart[productIndex].amount;

			if (productAmount >= productStock) {
				toast.error("Quantidade solicitada fora de estoque");
				return;
			} else {
				newCart[productIndex].amount++;
			}
		}

		if (productIndex < 0) {
			try {
				const { data: product } = await api.get<Product>(
					`/products/${productId}`
				);

				newCart.push({ ...product, amount: 1 });
			} catch (error) {
				toast.error("Erro na adição do produto");
			}
		}

		setCart(newCart);

		localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
	};

	const removeProduct = (productId: number) => {
		try {
			// TODO
		} catch {
			// TODO
		}
	};

	const updateProductAmount = async ({
		productId,
		amount,
	}: UpdateProductAmount) => {
		try {
			// TODO
		} catch {
			// TODO
		}
	};

	return (
		<CartContext.Provider
			value={{ cart, addProduct, removeProduct, updateProductAmount }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart(): CartContextData {
	const context = useContext(CartContext);

	return context;
}
