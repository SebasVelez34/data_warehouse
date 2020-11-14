const login = (() => {
	init = () => {
		const loginForm = document.querySelector("#loginForm");
		if(loginForm)
			loginForm.onsubmit = async (e) => {
				e.preventDefault();
				const data = getData();
				const user = await loginRequest(data);
				if(user){
					console.log("WElo");
					window.open(`${APP_URL}/contacts.html`,'_self');
				}
				
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
        .then(data => {
			localStorage.setItem('dw-token',data.token);
			localStorage.setItem('role',data.isAdmin);
			return data;
		});
        return user;
	};

	return {
		init,
	};
})();

login.init();
