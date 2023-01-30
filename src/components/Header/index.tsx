import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { MdShoppingBasket } from "react-icons/md";
import { Container, Cart } from "./styles";

export function Header() {
	const { cart } = useCart();
	// const cartSize = // TODO;

	return (
		<Container>
			<Link to="/">
				<img src={logo} alt="Rocketshoes" />
			</Link>

			<Cart to="/cart">
				<div>
					<strong>Meu carrinho</strong>
					<span data-testid="cart-size">
						{/* {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`} */}
					</span>
				</div>
				<MdShoppingBasket size={36} color="#FFF" />
			</Cart>
		</Container>
	);
}
