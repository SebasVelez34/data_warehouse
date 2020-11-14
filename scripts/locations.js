const locations = (() => {
	init = () => {
		render();
		renderTree();
		createOrEdit();
		middelware();
		resetModal();
	};

	getRegions = async () => {
		return await fetch(`${API_URL}/location`, { headers })
			.then((data) => (data ? data.json() : data))
			.then((data) => data);
	};

	template = (regions) => {
		let html = "";
		regions
			.map((region) => {
				if (region.isActive)
					html += `
                    <li>
                        <a href="#">${region.name}
                            <button class="btn delete" type="button" title="Eliminar" data-action="delete" data-self="${
															region.id
														}" data-type="region" data-child="country" data-type-parent="region" data-parent="${
						region.id
					}"><i class="ni ni-fat-delete"></i></button>
                            <button class="btn edit" type="button" title="Editar" data-action="edit" data-self="${
															region.id
														}" data-type="region" data-child="country" data-type-parent="region" data-parent="${
						region.id
					}"><i class="ni ni-settings"></i></button>
                            <button class="btn create" type="button" title="Añadir un país" data-action="create" data-self="${
															region.id
														}" data-type="region" data-child="country" data-type-parent="region" data-parent="${
						region.id
					}"><i class="ni ni-fat-add"></i></button>
                        </a>
                        ${
													region.Countries
														? `
                            <ul>
                                ${region.Countries.map((country) => {
																	if (country.isActive)
																		return `
                                            <li>
                                                <a href="#">${country.name}
                                                    <button class="btn delete" type="button" title="Eliminar" data-action="delete" data-self="${
																											country.id
																										}" data-type="country" data-parent="${
																			region.id
																		}" data-child="city" data-type-parent="region"><i class="ni ni-fat-delete"></i></button>
                                                    <button class="btn edit" type="button" title="Editar" data-action="edit" data-self="${
																											country.id
																										}" data-type="country" data-parent="${
																			region.id
																		}" data-child="city" data-type-parent="region"><i class="ni ni-settings"></i></button>
                                                    <button class="btn create" type="button" title="Añadir una ciudad" data-action="create" data-self="${
																											country.id
																										}" data-type="country" data-parent="${
																			region.id
																		}" data-child="city" data-type-parent="region"><i class="ni ni-fat-add"></i></button>
                                                </a>
                                                ${
																									country.Cities
																										? `
                                                    <ul>
                                                        ${country.Cities.map(
																													(city) => {
																														if (city.isActive)
																															return `
                                                                    <li>
                                                                        <a href="#">${city.name}
                                                                            <button class="btn delete" type="button" title="Eliminar" data-action="delete" data-self="${city.id}" data-type="city" data-parent="${country.id}" data-type-parent="country"><i class="ni ni-fat-delete"></i></button>
                                                                            <button class="btn edit" type="button" title="Editar" data-action="edit" data-self="${city.id}" data-type="city" data-parent="${country.id}" data-type-parent="country"><i class="ni ni-settings"></i></button>
                                                                        </a>
                                                                    </li>
                                                                `;
																													}
																												).join("")}
                                                    </ul>
                                                `
																										: ""
																								}
                                            </li>
                                        `;
																}).join("")}
                            </ul>
                        `
														: ""
												}
                        
                    <li>
                `;
			})
			.join("");
		return html;
	};

	render = async () => {
		const regions = await getRegions();
		const parent = document.querySelector(".mtree.bubba");
		const html = template(regions);
		cleanTree();
		parent.insertAdjacentHTML("afterbegin", html);
	};

	cleanTree = () => {
		$(".mtree.bubba li").remove();
	};

	middelware = () => {
		$(document).on(
			"click",
			"button.create,button.edit,button.delete",
			async function () {
				const action = $(this).data("action");
				const typeParent = $(this).data("type");
				const id = $(this).data("self");
				const parent = $(this).data("parent");
				const dataTypeParent = $(this).data("type-parent");
				cleanModal();
				if (action === "create") {
					const type = $(this).data("child");
					titleLocation(typeParent);
					$("#modal-form").modal("show");
					$("#locationParent").attr("name", `${typeParent}_id`).val(id);

					createOrEdit(post, { type });
				} else if (action === "delete") {
					showConfirm({
						callbackConfirm: async () => {
							const type = typeParent;
							const response = await deleteLocation({
								type,
								id,
								data: { parent },
							});
							if ("status" in response) {
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
							renderTree();
						},
						callbackCancel: () => {},
					});
				} else if (action === "edit") {
					const type = $(this).data("type");
					titleLocation(typeParent);
					await edit({ type, id });
					$("#modal-form").modal("show");
					$("#locationParent").attr("name", `${dataTypeParent}_id`).val(parent);
					createOrEdit(put, { type, id });
				}
			}
		);
	};

	titleLocation = (title = true) => {
		title =
			title === "region" ? "País" : title === "country" ? "Ciudad" : title;
		$("#titleLocation").text(title);
	};

	createOrEdit = (action = post, params = {}) => {
		const form = document.querySelector("#formCreateLocation");
		form.onsubmit = (e) => {
			e.preventDefault();
			const data = formData(form);
			const isInvalid = objectHasEmpties(data);
			if (!isInvalid) {
				const newLocation = action({ data, ...params });
				newLocation
					.then((location) => {
						if ("name" in location) {
							$("#modal-form").modal("hide");
							render();
							renderTree();
							showAlert("Excelente", "Bien hecho", "success");
						} else {
							showAlert("Error", location.msg, "error", "danger");
						}
					})
					.catch((e) => {
						showAlert("Error", "Error", "danger");
					});
			}
		};
	};
	cleanModal = () => {
		$("#formCreateLocation").get(0).reset();
	};

	resetModal = () => {
		const btn = document.querySelector("#createRegion");
		if (btn)
			btn.addEventListener("click", () => {
				cleanModal();
				titleLocation("Región");
			});
	};

	post = async ({ data, type = "region" }) => {
		return await fetch(`${API_URL}/location/${type}`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	put = async ({ data, type, id }) => {
		return await fetch(`${API_URL}/location/${type}/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	edit = async ({ type, id }) => {
		await fetch(`${API_URL}/location/${type}/${id}`,{ headers })
			.then((data) => data.json())
			.then((data) => {
				$("#modal-form").modal("show");
				$("#modal-form input").each((i, v) => {
					$(v).val(data[$(v).attr("name")]);
				});
			});
	};

	deleteLocation = async ({ data, type, id }) => {
		return await fetch(`${API_URL}/location/${type}/${id}`, {
			method: "DELETE",
			body: JSON.stringify(data),
			headers: {
                "Content-Type": "application/json",
                ...headers
			},
		}).then((data) => data.json());
	};

	renderTree = () => {
		setTimeout(() => {
			if ($("ul.mtree").length) {
				const collapsed = true;
				const close_same_level = false;
				const duration = 400;
				const listAnim = true;
				const easing = "easeOutQuart";

				$(".mtree ul").css({
					overflow: "hidden",
					height: collapsed ? 0 : "auto",
					display: collapsed ? "none" : "block",
				});

				const node = $(".mtree li:has(ul)");
				node.each(function () {
					$(this).children(":first-child").css("cursor", "pointer");
					$(this).addClass(
						"mtree-node mtree-" + (collapsed ? "closed" : "open")
					);
					$(this)
						.children("ul")
						.addClass(
							"mtree-level-" +
								($(this).parentsUntil($("ul.mtree"), "ul").length + 1)
						);
				});

				$(".mtree li > *:first-child").on("click.mtree-active", function (e) {
					if ($(this).parent().hasClass("mtree-closed")) {
						$(".mtree-active")
							.not($(this).parent())
							.removeClass("mtree-active");
						$(this).parent().addClass("mtree-active");
					} else if ($(this).parent().hasClass("mtree-open")) {
						$(this).parent().removeClass("mtree-active");
					} else {
						$(".mtree-active")
							.not($(this).parent())
							.removeClass("mtree-active");
						$(this).parent().toggleClass("mtree-active");
					}
				});

				node.children(":first-child").on("click.mtree", function (e) {
					const el = $(this).parent().children("ul").first();
					const isOpen = $(this).parent().hasClass("mtree-open");

					if ((close_same_level || $(".csl").hasClass("active")) && !isOpen) {
						const close_items = $(this)
							.closest("ul")
							.children(".mtree-open")
							.not($(this).parent())
							.children("ul");

						if ($.Velocity) {
							close_items.velocity(
								{
									height: 0,
								},
								{
									duration: duration,
									easing: easing,
									display: "none",
									delay: 100,
									complete: function () {
										setNodeClass($(this).parent(), true);
									},
								}
							);
						} else {
							close_items.delay(100).slideToggle(duration, function () {
								setNodeClass($(this).parent(), true);
							});
						}
					}

					el.css({ height: "auto" });

					if (!isOpen && $.Velocity && listAnim)
						el.find(" > li, li.mtree-open > ul > li")
							.css({ opacity: 0 })
							.velocity("stop")
							.velocity("list");

					if ($.Velocity) {
						el.velocity("stop").velocity(
							{
								height: isOpen ? [0, el.outerHeight()] : [el.outerHeight(), 0],
							},
							{
								queue: false,
								duration: duration,
								easing: easing,
								display: isOpen ? "none" : "block",
								begin: setNodeClass($(this).parent(), isOpen),
								complete: function () {
									if (!isOpen) $(this).css("height", "auto");
								},
							}
						);
					} else {
						setNodeClass($(this).parent(), isOpen);
						el.slideToggle(duration);
					}

					e.preventDefault();
				});

				function setNodeClass(el, isOpen) {
					if (isOpen) {
						el.removeClass("mtree-open").addClass("mtree-closed");
					} else {
						el.removeClass("mtree-closed").addClass("mtree-open");
					}
				}

				if ($.Velocity && listAnim) {
					$.Velocity.Sequences.list = function (element, options, index, size) {
						$.Velocity.animate(
							element,
							{
								opacity: [1, 0],
								translateY: [0, -(index + 1)],
							},
							{
								delay: index * (duration / size / 2),
								duration: duration,
								easing: easing,
							}
						);
					};
				}

				if ($(".mtree").css("opacity") == 0) {
					if ($.Velocity) {
						$(".mtree")
							.css("opacity", 1)
							.children()
							.css("opacity", 0)
							.velocity("list");
					} else {
						$(".mtree").show(200);
					}
				}
			}
		}, 500);
	};

	return {
		init,
		createOrEdit,
		getRegions,
	};
})();
