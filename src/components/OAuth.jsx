import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate("/");
		} catch (error) {
			toast.error("Não foi possível autenticar com o Google");
		}
	};

	return (
		<div className="socialLogin" style={{marginTop: "4px"}}>
			<p>{location.pathname === "/sign-up" ? "Cadastrar" : "Entrar"} com provedor: </p>
			<button style={{marginTop: "4px"}} className="socialIconDiv" onClick={onGoogleClick}>
				<img className="socialIconImg" src={googleIcon} alt="google icon" />
			</button>
		</div>
	);
}

export default OAuth;
