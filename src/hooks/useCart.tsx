import produce from "immer";
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
		const storagedCart = Buscar dados do localStorage

		if (storagedCart) {
		  return JSON.parse(storagedCart);
		}

		return [];
	});

	const newCart = [...cart];

	const addProduct = async (productId: number) => {
		const isProductAlreadyInCart = newCart.findIndex(
			(product) => product.id === productId
		);

		if (isProductAlreadyInCart <= 0) {
			const { data } = await api.get<Omit<Product, "amount">>(
				`/products/${productId}`
			);

			newCart.push({ ...data, amount: 1 });

			setCart(newCart);
		} else {
			newCart[isProductAlreadyInCart].amount++;

			setCart(newCart);
		}
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
