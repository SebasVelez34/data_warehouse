const login = (() => {
	init = () => {
		document.querySelector("#loginForm").onsubmit = (e) => {
			e.preventDefault();
            const data = getData();
            loginRequest(data);
            
            
		};
	};
	getData = () => {
		const form = document.querySelectorAll("#loginForm input");
		return {
			email: form[0].value,
			password: form[1].value,
		};
	};

	loginRequest = async (data) => {
		const user = await fetch(`${API_URL}/user/signin`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
        }).then(data => data.json())
        .then(data => localStorage.setItem('dw-token',data.token));
        return user;
	};

	return {
		init,
	};
})();

login.init();
