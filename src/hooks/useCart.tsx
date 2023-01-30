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

	const removeProduct = (productId: number) => {
		try {
			const productIndex = newCart.findIndex(
				(product) => product.id === productId
			);

			if (productIndex < 0) {
				toast.error("Erro na remoção do produto");
				return;
			}

			const anotherCart = newCart
				.slice(0, productIndex)
				.concat(newCart.slice(productIndex + 1));

			setCart(anotherCart);

			toast.success("Produto removido com sucesso!");

			localStorage.setItem("@RocketShoes:cart", JSON.stringify(anotherCart));
		} catch (error) {
			toast.error("Erro na remoção do produto");
		}
	};

	const updateProductAmount = async ({
		productId,
		amount,
	}: UpdateProductAmount) => {
		let productStock = 0;

		try {
			const { data: StockInfo } = await api.get<Stock>(`/stock/${productId}`);

			productStock = StockInfo.amount;
		} catch (error) {
			toast.error("Erro na alteração de quantidade do produto");
			return;
		}

		const productIndex = newCart.findIndex(
			(product) => product.id === productId
		);

		if (productIndex < 0) {
			toast.error("Erro na alteração de quantidade do produto");
			return;
		}

		const productAmount = newCart[productIndex].amount;

		if (amount < productAmount) {
			if (productAmount === 1) {
				return;
			} else {
				newCart[productIndex].amount = amount;
			}
		}

		if (amount > productAmount) {
			if (productAmount >= productStock) {
				toast.error("Quantidade solicitada fora de estoque");
				return;
			} else {
				newCart[productIndex].amount = amount;
			}
		}

		setCart(newCart);

		localStorage.setItem("@RocketShoes:cart", JSON.stringify(newCart));
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
