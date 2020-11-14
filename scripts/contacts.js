const contacts = (() => {
	init = () => {
		render();
		multipleSelect();
	};

	getContacts = async () => {
		return await fetch(`${API_URL}/contact`,{
            headers
        })
			.then((data) => data.json())
			.then((data) => data);
	};

	template = (data) => {
		return `
            <tr role="row" class="odd">
                <td>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input"
                            id="${data.id}">
                        <label class="custom-control-label" for="${data.id}"></label>
                    </div>
                </td>
                <td class="sorting_1">${data.name} ${data.lastname}</td>
                <td>${data?.City?.name ?? ""}/${data?.City?.Country?.Region?.name ?? ""}</td>
                <td>${data.Company.name}</td>
                <td>${data.interest}</td>
                <td class="text-center">
                    <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="${APP_URL}/pages/contacts/show.html?contact=${data.id}">Ver</a>
                            <a class="dropdown-item" href="${APP_URL}/pages/contacts/edit.html?contact=${data.id}">Editar</a>
                            <a class="dropdown-item" href="#" onclick="contacts.destroy('${data.id}')">Eliminar</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
	};

	render = async () => {
		const data = await getContacts();
		const parent = document.querySelector("#contactTable");
		const html = data.map((contact) => template(contact)).join("");
		cleanTable();
		parent.insertAdjacentHTML("afterbegin", html);
		initializeDataTable("datatable-buttons");
	};

	renderCreate = async () => {
		createOrEdit();
		await companiesR();
		await locationsR();
		regionChange();
	};

	companiesR = async () => {
		await $.getScript("../../scripts/companies.js",{
            headers
        });
		const company = await companies.getCompanies();
		company
			.map((company) =>
				$("#company").append(
					`<option value="${company.id}">${company.name}</option>`
				)
			)
			.join("");
	};

	locationsR = async () => {
		await $.getScript("../../scripts/locations.js",{
            headers
        });
		const location = await locations.getRegions();
		localStorage.setItem("locations", JSON.stringify(location));
		$("#region option").empty();
		location
			.map((region) =>
				$("#region").append(
					`<option value="${region.id}">${region.name}</option>`
				)
			)
			.join("");
	};

	renderEdit = async (showView = false) => {
		const contact = new URL(location.href).searchParams.get("contact");
		createOrEdit(put, { contact });
		await companiesR();
		await locationsR();
		const contactData = await show({ contact });
		const region = $("#region");
		const country = $("#country");
		const city = $("#city");
		$("#form-contact input,#company,#interest").each((i, v) => {
			$(v).val(contactData[$(v).attr("name")]);
		});
		contactData.Contacts_channels.map((channel) => {
			const parent = $(`option[value='${channel.contact_channel}']`).closest(
				"div"
			);
			const option = $(`option[value='${channel.contact_channel}']`);
			$(option).attr("selected", true);
			$(parent).next().find('[name="user_account"]').val(channel.user_account);
			$(parent)
				.next()
				.next()
				.find('[name="preferences"]')
				.val(channel.preferences);
		});
		const {
			City: {
				id: cityID,
				Country: {
					id: countryID,
					Region: { id: regionID },
				},
			},
		} = contactData;
		$(region).val(regionID);
		setTimeout(function () {
			$(region).trigger("change");
		}, 100);
		$(country).val(countryID);
		setTimeout(function () {
			$(country).trigger("change");
		}, 100);
		$(city).val(cityID);
		setTimeout(function () {
			if (showView) $("input,select").attr("disabled", true);
		}, 100);

		regionChange();
	};

	regionChange = () => {
		const region = $("#region");
		const country = $("#country");
		$(region).on("change", function () {
			const locations = JSON.parse(localStorage.getItem("locations"));
			const regionSelected = locations.find(
				(location) => location.id == $(region).val()
			);
			country.removeAttr("disabled");
			$("#country option").empty();
			regionSelected.Countries.map((country) =>
				$("#country").append(
					`<option value="${country.id}">${country.name}</option>`
				)
			);
		});
		countryChange();
	};

	countryChange = () => {
		const country = $("#country");
		const region = $("#region");
		const city = $("#city");
		$(country).on("change", function () {
			const locations = JSON.parse(localStorage.getItem("locations"));
			const regionSelected = locations.find(
				(location) => location.id == $(region).val()
			);
			const countrySelected = regionSelected.Countries.find(
				(location) => location.id == $(country).val()
			);
			city.removeAttr("disabled");
			$("#city option").empty();
			countrySelected.Cities.map((city) =>
				$("#city").append(`<option value="${city.id}">${city.name}</option>`)
			);
		});
	};

	cleanTable = () => {
		$("#contactTable tr").remove();
	};

	multipleSelect = () => {
		$(document).on("click", "#btn-multiple-delete", () => {
			showConfirm({
				callbackConfirm: async () => {
					let data = [];
					$("input:checkbox:checked").each((i, v) => {
						data.push($(v).attr("id"));
					});
					const response = await deleteContacts({ data });
					if ("msg" in response) {
                        await contacts.render();
						showAlert("Excelente", "Bien hecho", "success");
						$("#delete-contacts").addClass("d-none");
                        $("#badge-selected").text(``);
					} else {
						showAlert(
							"Error",
							"Hubo un error intentando eliminar la compañía",
							"error",
							"danger"
						);
					}
				},
				callbackCancel: () => {},
			});
		});
		$(document).on("click", "#selectAllContacts", function () {
			const chk = $(".custom-control-input:not('#selectAllContacts')");
			const status = $(this).is(":checked");
			status ? $(chk).attr("checked", status) : $(chk).removeAttr("checked");
		});
		$(document).on("click", ".custom-control-input", () => {
			const selected = $("input:checkbox:checked").length;
			if (selected > 1) {
				$("#container-buttons").removeClass("d-none");
				$("#badge-selected").text(`${selected} Seleccionados`);
			} else {
				$("#container-buttons").addClass("d-none");
				$("#badge-selected").text(``);
			}
		});
	};

	createOrEdit = (action = post, params = {}) => {
		const form = document.querySelector("#form-contact");
		form.onsubmit = (e) => {
			e.preventDefault();
			const dataRequired = formData(form, "input[required],select[required]");
			const isInvalid = objectHasEmpties(dataRequired);
			if (!isInvalid) {
				const data = $(form)
					.serializeArray()
					.reduce(function (obj, item) {
						if (item.name in obj) {
							obj[item.name] =
								typeof obj[item.name] === "string"
									? [obj[item.name], item.value]
									: [...obj[item.name], item.value].flat();
						} else {
							obj[item.name] = item.value;
						}
						return obj;
					}, {});
				const newContact = action({ data, ...params });
				newContact
					.then((contact) => {
						if ("name" in contact) {
							renderCreate();
							showAlert("Excelente", "Bien hecho", "success");
							setTimeout(() => {
								window.open(`${window.location.origin}/contacts.html`, "_self");
							}, 2500);
						} else {
							showAlert("Error", contact.msg, "error", "danger");
						}
					})
					.catch((e) => {
						showAlert("Error", "Error", "danger");
					});
			}
		};
	};

	post = async ({ data }) => {
		return await fetch(`${API_URL}/contact`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	put = async ({ data, contact }) => {
		return await fetch(`${API_URL}/contact/${contact}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	show = async ({ contact }) => {
		return await fetch(`${API_URL}/contact/${contact}`,{ headers }).then((data) =>
			data.json()
		);
	};

	destroy = async (contact) => {
		showConfirm({
			callbackConfirm: async () => {
				const response = await deleteContact(contact);
				if ("msg" in response) {
					showAlert("Excelente", "Bien hecho", "success");
				} else {
					showAlert(
						"Error",
						"Hubo un error intentando eliminar la compañía",
						"error",
						"danger"
					);
				}
				render();
			},
			callbackCancel: () => {},
		});
	};

	deleteContacts = async ({ data }) => {
		return await fetch(`${API_URL}/contact`, {
			method: "DELETE",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	deleteContact = async (contact) => {
		return await fetch(`${API_URL}/contact/${contact}`, {
            method: "DELETE",
            headers,
		}).then((data) => data.json());
	};

	return {
		init,
		renderCreate,
		renderEdit,
        destroy,
        render
	};
})();
