const companies = (() => {
	init = () => {
		render();
		createOrEdit();
		resetModal();
		citiesOnModal();
	};

	getCompanies = async () => {
		return await fetch(`${API_URL}/company`)
			.then((data) => data.json())
			.then((data) => data);
	};

	getCities = async () => {
		return await fetch(`${API_URL}/location/cities`)
			.then((data) => data.json())
			.then((data) => data);
	};

	template = (data) => {
		return `
            <tr role="row" class="odd">
                <td class="sorting_1">${data.name}</td>
                <td>${data.address}</td>
                <td>${data.email}</td>
                <td>${data.phone}</td>
                <td>${data.City.name}</td>
                <td class="text-center">
                    <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="#" onclick="companies.edit('${
															data.id
														}')">Editar</a>
                            <a class="dropdown-item" href="#" onclick="companies.destroy('${
															data.id
														}')">Eliminar</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
	};

	edit = async (company) => {
		await fetch(`${API_URL}/company/${company}`)
			.then((data) => data.json())
			.then((data) => {
				$("#modal-form").modal("show");
				$("#modal-form input,select").each((i, v) => {
					$(v).val(data[$(v).attr("name")]);
				});
			});
		createOrEdit(put, { company });
	};

	destroy = (company) => {
		showConfirm({
			callbackConfirm: async () => {
                const response = await deleteCompany(company);
                if ("msg" in response) {
                    showAlert("Excelente", "Bien hecho", "success");
                }else{
                    showAlert("Error", "Hubo un error intentando eliminar la compañía", "error", "danger");
                }
				render();
			},
			callbackCancel: () => {},
		});
	};

	citiesOnModal = async () => {
		const cities = await getCities();
		const select = document.querySelector('#city_id');
		console.log(cities);
		let html = ''
		cities.map(city =>{
			html += `<option value="${city.id}">${city.name}</option>`;
		});
		select.insertAdjacentHTML("afterbegin", html);
	}

	render = async () => {
		const data = await getCompanies();
		const parent = document.querySelector("#companyTable");
        const html = data.map((company) => template(company)).join("");
        cleanTable();
        parent.insertAdjacentHTML("afterbegin", html);
		initializeDataTable("datatable-buttons");
	};

	cleanTable = () => {
		$("#companyTable tr").remove();
	};

	createOrEdit = (action = post, params = {}) => {
		const form = document.querySelector("#formCreateCompany");
		form.onsubmit = (e) => {
			e.preventDefault();
			const data = formData(form,"input,select");
			const isInvalid = objectHasEmpties(data);
			if (!isInvalid) {
				const newCompany = action({ data, ...params });
				newCompany
					.then((company) => {
						if ("name" in company) {
							$("#modal-form").modal("hide");
							render();
							showAlert("Excelente", "Bien hecho", "success");
						} else {
							showAlert("Error", company.msg, "error", "danger");
						}
					})
					.catch((e) => {
						showAlert("Error", "Error", "danger");
					});
			}
		};
	};

	post = async ({ data }) => {
		return await fetch(`${API_URL}/company`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((data) => data.json());
	};

	put = async ({ data, company }) => {
		return await fetch(`${API_URL}/company/${company}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		}).then((data) => data.json());
	};

	deleteCompany = async (company) => {
		return await fetch(`${API_URL}/company/${company}`, {
			method: "DELETE",
		}).then((data) => data.json());
	};

	cleanModal = () => {
		$("#formCreateCompany").get(0).reset();
	};

	resetModal = () => {
		const btn = document.querySelector("#createCompany");
		if (btn)
			btn.addEventListener("click", () => {
				cleanModal();
			});
	};

	return {
		init,
		destroy,
		edit,
		getCompanies
	};
})();

