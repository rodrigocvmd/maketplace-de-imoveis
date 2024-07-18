import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
	const auth = getAuth();
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	});

	const { name, email } = formData;

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, "listings");

			const q = query(
				listingsRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			);

			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListings(listings);
			setLoading(false);
		};
	}, [auth.currentUser.uid]);

	const onLogout = () => {
		auth.signOut();
		navigate("/");
	};

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});

				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					name,
				});
			}
		} catch (error) {
			toast.error("Não foi possível atualizar as informações");
		}
	};

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onDelete = async (listingId) => {
		if (window.confirm("Tem certeza que deseja deletar o anúnio?")) {
			await deleteDoc(doc(db, "listings", listingId));
			const updatedListings = listings.filter((listing) => listing.id !== listingId);
			setListings(updatedListings);
			toast.success("Anúncio deletado com sucesso!");
		}
	};

	const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">Meu Perfil</p>
				<button type="button" onClick={onLogout} className="logOut">
					Sair
				</button>
			</header>
			<main>
				<div className="profileDetailsHeader">
					<p className="profileDetailsText">Informações Pessoais</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							changeDetails && onSubmit();
							setChangeDetails((prevState) => !prevState);
						}}>
						{changeDetails ? "Salvar dados de perfil" : "Atualizar perfil"}
					</p>
				</div>
				<div className="profileCard">
					<form>
						<input
							type="text"
							id="name"
							className={!changeDetails ? "profileName" : "profileNameActive"}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>
						<input
							type="text"
							id="email"
							className={!changeDetails ? "profileEmail" : "profileEmailActive"}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link to="/create-listing" className="createListing">
					<img src={homeIcon} alt="início/casa" />
					<p>Crie um anúncio para vender ou alugar seu imóvel</p>
					<img src={arrowRight} alt="seta para direita" />
				</Link>

				{!loading && listings?.length > 0 && (
					<>
						<p className="listingText">Seus anúncios</p>
						<ul className="listingsList">
							{listings.map((listing) => (
								<ListingItem
									key={listing.id}
									listing={listing.data}
									id={listing.id}
									onDelete={() => onDelete(listing.id)}
									onEdit={() => onEdit(listing.id)}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
}

export default Profile;
