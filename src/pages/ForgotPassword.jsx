import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";

function ForgotPassword() {
	const [email, setEmail] = useState("");

	const onChange = (e) => setEmail(e.target.value);

	const onSubmit = async (e) => {
		e.preventDefault;
		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email);
			toast.success("Email enviado");
		} catch (error) {
			toast.error("Não foi possível enviar o email de restauração de senha");
		}
	};

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Esqueci minha senha</p>
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
					<Link className="forgotPasswordLink" to="/sign-in">
						Entrar
					</Link>
					<div className="signInBar">
						<div className="signInText">Receber link para restaurar a senha</div>
						<button className="signInButton">
							<ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
						</button>
					</div>
				</form>
			</main>
		</div>
	);
}

export default ForgotPassword;
