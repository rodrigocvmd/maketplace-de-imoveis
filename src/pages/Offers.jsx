import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListing, setLastFetchedListing] = useState(null);

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const listingsRef = collection(db, "listings");

				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(10)
				);

				const querySnap = await getDocs(q);

				const lastVisible = querySnap.docs[querySnap.docs.length - 1];
				setLastFetchedListing(lastVisible);

				const listings = [];

				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error("Não foi possível buscar os imóveis");
			}
		};

		fetchListings();
	}, []);

	const onFetchMoreListings = async () => {
		try {
			const listingsRef = collection(db, "listings");

			const q = query(
				listingsRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListing),
				limit(10)
			);

			const querySnap = await getDocs(q);

			const lastVisible = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(lastVisible);

			const listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings((prevState) => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			toast.error("Não foi possível buscar os imóveis");
		}
	};

	return (
		<div className="category">
			<header>
				<p className="pageHeader">Ofertas</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map((listing) => (
								<ListingItem listing={listing.data} id={listing.id} key={listing.id} />
							))}
						</ul>
					</main>
					<br />
					<br />

					{/* {lastFetchedListing && (
						<p className="loadMore" onClick={onFetchMoreListings}>
							Carregar mais
						</p>
					)} */}
				</>
			) : (
				<p>Sem ofertas no momento... : (</p>
			)}
		</div>
	);
}

export default Offers;
