import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import {
	CartContextData,
	CartProviderProps,
	Product,
	Stock,
	UpdateProductAmount,
} from "../types";

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

		toast.success("Produto adicionado com sucesso!");

		localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
	};

	const removeProduct = async (productId: number) => {
		try {
			await api.get<Stock>(`/stock/${productId}`);
		} catch (error) {
			toast.error("Erro na remoção do produto");
			return;
		}

		const productIndex = newCart.findIndex(
			(product) => product.id === productId
		);

		newCart.splice(productIndex);

		setCart(newCart);

		toast.success("Produto removido com sucesso!");

		localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
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
