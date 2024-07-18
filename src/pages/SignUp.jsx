import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import OAuth from "../components/OAuth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";

function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const { name, email, password } = formData;

	const navigate = useNavigate();

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();

			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			const user = userCredential.user;

			updateProfile(auth.currentUser, {
				displayName: name,
			});

			const formDataCopy = { ...formData };
			delete formDataCopy.password;
			formDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, "users", user.uid), formDataCopy);

			navigate("/");
		} catch (error) {
			toast.error("Algo deu errado com o cadastro");
		}
	};

	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Bem-vindo(a) de volta!</p>
				</header>

				<main>
					<form onSubmit={onSubmit}>
						<input
							type="text"
							className="nameInput"
							placeholder="Nome"
							id="name"
							value={name}
							onChange={onChange}
						/>

						<input
							type="email"
							className="emailInput"
							placeholder="Email"
							id="email"
							value={email}
							onChange={onChange}
						/>
						<div className="passwordInputDiv">
							<input
								type={showPassword ? "text" : "password"}
								className="passwordInput"
								placeholder="Senha"
								id="password"
								value={password}
								onChange={onChange}
							/>

							<img
								src={VisibilityIcon}
								alt="mostrar senha"
								className="showPassword"
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
						</div>
						<Link to="/forgot-password" className="forgotPasswordLink">
							Esqueci a senha
						</Link>
						<div className="signUpBar" style={{ marginTop: "6px" }}>
							<p className="signUpText">Cadastrar</p>
							<button className="signInButton">
								<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
							</button>
						</div>
					</form>

					<OAuth />
					<hr style={{ width: "180px" }}></hr>
					<Link to="/sign-in" className="registerLink" style={{ marginTop: "16px" }}>
						Já tenho uma conta
					</Link>
				</main>
			</div>
		</>
	);
}

export default SignUp;
