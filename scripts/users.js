const users = (()=>{

    init = () => {
        render();
        createOrEdit();
    };
    
    getUsers = async () => {
		return await fetch(`${API_URL}/user`,{ headers })
			.then((data) => data.json())
			.then((data) => data);
    };
    
    template = (data) => {
		return `
            <tr role="row" class="odd">
                <td class="sorting_1">${data.name}</td>
                <td>${data.lastname}</td>
                <td>${data.email}</td>
                <td>${data.isAdmin ? "Sí" : "No"}</td>
                <td class="text-center">
                    <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="#" onclick="users.edit('${
															data.id
														}')">Editar</a>
                            <a class="dropdown-item" href="#" onclick="users.destroy('${
															data.id
														}')">Eliminar</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    };
    
    render = async () => {
		const data = await getUsers();
		const parent = document.querySelector("#userTable");
        const html = data.map((user) => template(user)).join("");
        cleanTable();
        parent.insertAdjacentHTML("afterbegin", html);
		initializeDataTable("datatable-buttons");
    };

    createOrEdit = (action = post, params = {}) => {
		const form = document.querySelector("#formCreateUser");
		form.onsubmit = (e) => {
			e.preventDefault();
			const data = formData(form,"input,select");
			const isInvalid = objectHasEmpties(data);
			if (!isInvalid) {
				const newCompany = action({ data, ...params });
				newCompany
					.then((user) => {
						if ("name" in user) {
							$("#modal-form").modal("hide");
							render();
							showAlert("Excelente", "Bien hecho", "success");
						} else {
							showAlert("Error", user.msg, "error", "danger");
						}
					})
					.catch((e) => {
						showAlert("Error", "Error", "danger");
					});
			}
		};
    };

    edit = async (user) => {
		await fetch(`${API_URL}/user/${user}`,{ headers })
			.then((data) => data.json())
			.then((data) => {
				$("#modal-form").modal("show");
				$("[name='password']").closest('.form-group').remove();
				$("#modal-form input,select").each((i, v) => {
                    if(v.type === "checkbox"){
                        $(v).attr('checked',data[$(v).attr("name")])
                    }else{
                        $(v).val(data[$(v).attr("name")]);
                    }
				});
			});
		createOrEdit(put, { user });
	};
    
    post = async ({ data }) => {
		return await fetch(`${API_URL}/user/register`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				...headers
			},
		}).then((data) => data.json());
    };
    
    put = async ({ data, user }) => {
		return await fetch(`${API_URL}/user/${user}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				...headers
			},
		}).then((data) => data.json());
	};
    
    destroy = (user) => {
		showConfirm({
			callbackConfirm: async () => {
                const response = await deleteUser(user);
                if ("msg" in response) {
                    showAlert("Excelente", "Bien hecho", "success");
                }else{
                    showAlert("Error", "Hubo un error intentando eliminar el usuario", "error", "danger");
                }
				render();
			},
			callbackCancel: () => {},
		});
	};
    
    cleanTable = () => {
		$("#userTable tr").remove();
    };

    deleteUser = async (user) => {
		return await fetch(`${API_URL}/user/${user}`, {
			method: "DELETE",
			headers
		}).then((data) => data.json());
	};
    
    return {
        init,
        edit,
        destroy
    }
})();

users.init();