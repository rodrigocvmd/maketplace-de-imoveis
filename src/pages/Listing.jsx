import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

function Listing() {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};

		fetchListing();
	}, [navigate, params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	return (
		<main>
			{/* TODO: */}
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				slidesPerView={1}
				pagination={{ clickable: true }}
				navigation
				style={{ height: "450px" }}>
				{listing.imgUrls.map((url, index) => {
					return (
						<SwiperSlide key={index}>
							<div
								className="swiperSlideDiv"
								style={{
									background: `url(${listing.imgUrls[index]}) center no-repeat`,
									backgroundSize: "cover",
								}}></div>
						</SwiperSlide>
					);
				})}
			</Swiper>
			<div
				className="shareIconDiv"
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}>
				<img src={shareIcon} alt="ícone de compartilhamento" />
			</div>

			{shareLinkCopied && <p className="linkCopied">Link copiado!</p>}
			<div className="listingDetails">
				<p className="listingName">
					{listing.name} - R$ {""}
					{listing.offer
						? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
						: listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">Imóvel {listing.type === "rent" ? "para alugar" : "à venda"}</p>
				{listing.offer && (
					<p className="discountPrice">
						Desconto de R${" "}
						{(listing.regularPrice - listing.discountedPrice)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
					</p>
				)}

				<ul className="listingDetailsList">
					<li>{listing.bedrooms > 1 ? `${listing.bedrooms} Quartos` : "1 Quarto"}</li>
					<li>{listing.bathrooms > 1 ? `${listing.bathrooms} Banheiros` : "1 Banheiro"}</li>
					<li>{listing.parking && "Vaga"}</li>
					<li>{listing.furnished && "Mobiliado"}</li>
				</ul>

				{listing.geolocation.lat !== 0 && listing.geolocation.lng !== 0 && (
					<div>
						<p className="listingLocationTitle">Localização</p>
						<div className="leafletContainer">
							<MapContainer
								style={{ height: "100%", width: "100%" }}
								center={[listing.geolocation.lat, listing.geolocation.lng]}
								zoom={13}
								scrollWheelZoom={false}>
								<TileLayer
									attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
								/>

								<Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
									<Popup>{listing.location}</Popup>
								</Marker>
							</MapContainer>
						</div>
					</div>
				)}

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton">
						Entrar em contato com o propeitário
					</Link>
				)}
			</div>
		</main>
	);
}

export default Listing;
