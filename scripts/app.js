(() => {
	const location = window.location.origin;
	const isLogged = getToken();
	if (!isLogged) window.open(`${location}/login.html`, "_self");
	("use strict");
	window.addEventListener(
		"load",
		function () {
			var forms = document.getElementsByClassName("needs-validation");
			console.log(forms);
			var validation = Array.prototype.filter.call(forms, function (form) {
				form.addEventListener(
					"submit",
					function (event) {
						if (form.checkValidity() === false) {
							event.preventDefault();
							event.stopPropagation();
						}
						form.classList.add("was-validated");
					},
					false
				);
			});
		},
		false
	);
})();

function showAlert(title, text, type, buttonType = "success") {
	Swal.fire({
		title,
		text,
		type,
		buttonsStyling: !1,
		confirmButtonClass: `btn btn-${buttonType}`,
	});
}

function showConfirm({
	title = "¿Estás seguro?",
	text = "Éste cambio no es reversible",
	confirmButtonText = "Sí, Eliminar",
	cancelButtonText = "No, cancelar",
	callbackConfirm = () => {},
	callbackCancel = () => {},
}) {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-success",
			cancelButton: "btn btn-danger",
		},
		buttonsStyling: false,
	});

	swalWithBootstrapButtons
		.fire({
			title,
			text,
			showCancelButton: true,
			confirmButtonText,
			cancelButtonText,
			reverseButtons: true,
		})
		.then((result) => {
			if (result.isConfirmed) {
				callbackConfirm();
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				callbackCancel();
			}
		});
}

function initializeDataTable(table_id) {
	const table = $(`#${table_id}`);
	if (table instanceof $.fn.dataTable.Api) {
		$(`#${table_id}`).DataTable({
			language: {
				paginate: {
					previous: "<",
					next: ">",
				},
			},
		});
	}
}