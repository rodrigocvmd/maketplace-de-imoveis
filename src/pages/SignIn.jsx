import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import OAuth from "../components/OAuth";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { email, password } = formData;

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

			const userCredential = await signInWithEmailAndPassword(auth, email, password);

			if (userCredential.user) {
				navigate("/");
			}
		} catch (error) {
			toast.error("Credenciais inválidas");
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
						<div className="signInBar">
							<p className="signInText">Entrar</p>
							<button className="signInButton">
								<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
							</button>
						</div>
					</form>

					<OAuth />

					<hr style={{ width: "180px"}}></hr>
					<Link to="/sign-up" className="registerLink" style={{ marginTop: "16px" }}>
						Cadastre-se
					</Link>
				</main>
			</div>
		</>
	);
}

export default SignIn;
