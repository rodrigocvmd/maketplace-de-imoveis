import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import Slider from "../components/Slider";

function Explore() {
	return (
		<div className="explore">
			<header>
				<p className="pageHeader">Explorar</p>
			</header>

			<main>
				<Slider />

				<p className="exploreCategoryHeading">Categorias</p>
				<div className="exploreCategories">
					<Link to="/category/rent">
						<img src={rentCategoryImage} alt="alugueis" className="exploreCategoryImg" />
						<p className="exploreCategoryName">Imóveis para alugar</p>
					</Link>
					<Link to="/category/sale">
						<img src={sellCategoryImage} alt="vendas" className="exploreCategoryImg" />
						<p className="exploreCategoryName">Imóveis à venda</p>
					</Link>
				</div>
			</main>
		</div>
	);
}

export default Explore;
