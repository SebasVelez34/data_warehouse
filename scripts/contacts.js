const contacts = (() => {
	init = () => {
        render();
        multipleSelect();
    };

	getContacts = async () => {
		return await fetch(`${API_URL}/contact`)
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
                <td>${data.City.name}/${data.City.Country.Region.name}</td>
                <td>${data.Company.name}</td>
                <td>${data.interest}</td>
                <td class="text-center">
                    <div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="#" onclick="companies.edit('${data.id}')">Editar</a>
                            <a class="dropdown-item" href="#" onclick="companies.destroy('${data.id}')">Eliminar</a>
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
        const company = await companies.getCompanies();
        const location = await locations.getRegions();
        localStorage.setItem('locations',JSON.stringify(locations));
        const selectCompany = $("#form-company");
        const selectRegion = $("#form-region");
        company.map( company => selectCompany.append(`<option value="${company.id}">${company.name}</option>`)).join('');
        location.map(region => selectRegion.append(`<option value="${region.id}">${company.name}</option>`)).join('');
    }

    cleanTable = () => {
		$("#contactTable tr").remove();
    };
    
    multipleSelect = () =>{
        $(document).on("click",'#selectAllContacts',function () {
            const chk = $(".custom-control-input");
            const status = $(this).is(':checked'); 
            status ? $(chk).attr("checked",status) : $(chk).removeAttr("checked");
        });
        $(document).on("click",'.custom-control-input',()=>{
            const chk = $(".custom-control-input");
            if(chk.length > 1)
            $("#delete-contacts").removeClass('d-none');
        })
    }

	return {
        init,
        renderCreate
	};
})();

