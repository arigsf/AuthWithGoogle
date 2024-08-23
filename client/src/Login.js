import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const handleLoginSuccess = async (response) => {
		console.log('Login Success:', response);
		try {
			const res = await axios.post('http://localhost:3030/api/users/login/google', {
				token: response.credential,
			});
			localStorage.setItem('token', response.credential)
			console.log('Response from backend:', res.data);
			navigate("/protected");
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleLoginFailure = (response) => {
		console.log('Login Failed:', response);
	};
	return(
		<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
			<div>
				<h2>Login com Google</h2>
				<GoogleLogin
					onSuccess={handleLoginSuccess}
					onError={handleLoginFailure}
				/>
			</div>
		</GoogleOAuthProvider>
	);

};