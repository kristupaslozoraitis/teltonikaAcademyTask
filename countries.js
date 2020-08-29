async function GetCountries(page) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/countries?page=${page}`
  );
  const countries = await response.json();
  return countries.countires;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function GetCountry(id) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/countries/${id}`
  );
  const country = await response.json();
  return country;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function GetCity(id) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/cities/${id}`
  );
  const city = await response.json();
  return city;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function removeItem(id, countriesLength) {
  await fetch(`https://akademija.teltonika.lt/api1/countries/${id}`, {
    method: "DELETE",
  });
  if (countriesLength == 1) current_page--;
  initiate();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addItem(countriesCount) {
  if (countriesCount == 10) {
    current_page++;
  }
  fetch(`https://akademija.teltonika.lt/api1/countries`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: document.getElementById("name-input").value,
      area: document.getElementById("area-input").value,
      population: document.getElementById("pop-input").value,
      calling_code: document.getElementById("code-input").value,
    }),
  }).then(function (data) {
    if (data.status != 200) {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Nepavyko pridėti naujos šalies";
    } else {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Šalis sėkmingai pridėta";
    }
  });
  event.preventDefault();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateItem(idd) {
  var data = {
    name: document.getElementById("name-input").value,
    area: document.getElementById("area-input").value,
    population: document.getElementById("pop-input").value,
    calling_code: document.getElementById("code-input").value,
  };
  fetch(`https://akademija.teltonika.lt/api1/countries/${idd}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  }).then(function (data) {
    if (data.status != 200) {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Nepavyko atnaujinti įrašo";
    } else {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Įrašas sėkmingai atnaujintas";
    }
  });
  event.preventDefault();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function setMaxPages(page) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/countries?page=${page}`
  );
  const countries = await response.json();

  if (countries.countires.length > 0) {
    page++;
    await setMaxPages(page);
  } else pages = page - 1;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let rows = 10;
let current_page = 1;
var pages;
var tbody = document.getElementById("tbody");
var pagination_wrapper = document.getElementById("pagination-wrapper");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function initiate() {
  const countries = await GetCountries(current_page);
  DisplayCountries(countries);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addCountryForm() {
  var headers = [
    {
      name: "Pavadinimas",
      nameId: "myName",
      inputId: "name-input",
      divClass: "name-div",
    },
    {
      name: "Užimamas plotas",
      nameId: "myArea",
      inputId: "area-input",
      divClass: "area-div",
    },
    {
      name: "Gyventojų skaičius",
      nameId: "myPop",
      inputId: "pop-input",
      divClass: "pop-div",
    },
    {
      name: "Šalies Tel. kodas",
      nameId: "myCode",
      inputId: "code-input",
      divClass: "code-div",
    },
  ];
  var modal = document.getElementById("myModal");
  var modalcont = document.getElementById("modal-cont");
  var btn = document.getElementById("add-btn");
  var span = document.createElement("span");
  span.classList.add("close");
  span.innerHTML = "&times;";
  modalcont.appendChild(span);
  var message = document.createElement("span");
  message.setAttribute("id", "message");
  modalcont.appendChild(message);
  span.onclick = function () {
    modal.style.display = "none";
    modalcont.innerHTML = "";
    initiate();
  };
  let formHeader = document.createElement("h2");
  formHeader.classList.add("add-header");
  formHeader.innerText = "PRIDĖTI ŠALĮ";
  modalcont.appendChild(formHeader);
  let form = document.createElement("form");
  form.setAttribute("id", "adding-form");
  form.setAttribute("onSubmit", `addItem(${tbody.rows.length});`);
  modalcont.appendChild(form);
  for (let i = 0; i < headers.length; i++) {
    let input = document.createElement("input");
    Object.assign(input, {
      type: "text",
      id: headers[i].inputId,
    });
    let name = document.createElement("span");
    name.setAttribute("id", headers[i].nameId);
    name.innerText = headers[i].name;
    let div = document.createElement("div");
    div.classList.add(headers[i].divClass);
    div.appendChild(name);
    div.appendChild(input);
    form.appendChild(div);
  }
  let submitbtn = document.createElement("input");
  submitbtn.setAttribute("id", "submit-btn");
  submitbtn.setAttribute("type", "submit");
  submitbtn.setAttribute("value", "SAUGOTI");
  form.appendChild(submitbtn);
  modal.style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function editCountryForm(id) {
  const country = await GetCountry(id);
  var headers = [
    {
      name: "Pavadinimas",
      nameId: "myName",
      inputId: "name-input",
      divClass: "name-div",
      countryInfo: country.name,
    },
    {
      name: "Užimamas plotas",
      nameId: "myArea",
      inputId: "area-input",
      divClass: "area-div",
      countryInfo: country.area,
    },
    {
      name: "Gyventojų skaičius",
      nameId: "myPop",
      inputId: "pop-input",
      divClass: "pop-div",
      countryInfo: country.population,
    },
    {
      name: "Šalies Tel. kodas",
      nameId: "myCode",
      inputId: "code-input",
      divClass: "code-div",
      countryInfo: country.calling_code,
    },
  ];

  var modal = document.getElementById("myModal");
  var modalcont = document.getElementById("modal-cont");
  var btn = document.getElementById("edit-icon");
  var span = document.createElement("span");
  span.classList.add("close");
  span.innerHTML = "&times;";
  modalcont.appendChild(span);
  var message = document.createElement("span");
  message.setAttribute("id", "message");
  modalcont.appendChild(message);
  span.onclick = function () {
    modal.style.display = "none";
    modalcont.innerHTML = "";
    initiate();
  };
  let formHeader = document.createElement("h2");
  formHeader.classList.add("add-header");
  formHeader.innerText = "REDAGUOTI ŠALĮ";
  modalcont.appendChild(formHeader);
  let form = document.createElement("form");
  form.setAttribute("id", "editting-form");
  form.setAttribute("onSubmit", `updateItem(${id})`);
  modalcont.appendChild(form);
  for (let i = 0; i < headers.length; i++) {
    let input = document.createElement("input");
    Object.assign(input, {
      type: "text",
      id: headers[i].inputId,
      value: headers[i].countryInfo,
    });
    let name = document.createElement("span");
    name.setAttribute("id", headers[i].nameId);
    name.innerText = headers[i].name;
    let div = document.createElement("div");
    div.classList.add(headers[i].divClass);
    div.appendChild(name);
    div.appendChild(input);
    form.appendChild(div);
  }
  let submitbtn = document.createElement("input");
  submitbtn.setAttribute("id", "submit-btn");
  submitbtn.setAttribute("type", "submit");
  submitbtn.setAttribute("value", "SAUGOTI");
  form.appendChild(submitbtn);
  modal.style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function DisplayCountries(items) {
  await setMaxPages(1);
  while (pagination_wrapper.hasChildNodes()) {
    pagination_wrapper.removeChild(pagination_wrapper.firstChild);
  }
  if (pages > 1) {
    pagination(pagination_wrapper, rows);
  }
  const countries = items;
  tbody.innerHTML = "";
  var h = document.getElementById("main-header");
  h.innerText = "ŠALYS";
  var table = document.getElementById("allcountries");
  countries.forEach((country) => {
    let row = document.createElement("tr");
    tbody.appendChild(row);
    row.setAttribute("id", "myItems");
    let items = Object.values(country);
    for (let i = 1; i < 5; i++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `cell${i}`);
      if (cell.id == "cell1") {
        let a = document.createElement("a");
        a.innerText = items[i];
        a.setAttribute("href", "citiesPage.html?id=" + `${country.id}`);
        cell.appendChild(a);
      } else {
        let text = document.createTextNode(items[i]);
        cell.appendChild(text);
      }
      row.appendChild(cell);
    }
    let trashcell = document.createElement("td");
    trashcell.innerHTML = `<img id='trash' src='trash.png' alt='trash' onClick='removeItem(${country.id}, ${countries.length})'/>`;
    let editcell = document.createElement("td");
    editcell.innerHTML = `<img id='edit-icon' src='Vector.png' alt='edit-icon' onClick='editCountryForm(${country.id})'/>`;
    row.appendChild(trashcell);
    row.appendChild(editcell);
  });
  table.appendChild(tbody);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function pagination(wrapper) {
  const countries = await GetCountries(current_page);
  wrapper.innerHTML = "";
  //if (items.length > 10) {
  for (let i = 1; i < pages + 1; i++) {
    let btn = PaginationButton(i, countries);
    wrapper.appendChild(btn);
  }
  //}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function PaginationButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;
  button.setAttribute("value", page);
  button.setAttribute("id", "page-button");
  if (current_page == page) button.classList.add("active");
  button.addEventListener("click", async function () {
    current_page = button.innerText;
    items = await GetCountries(current_page);
    DisplayCountries(items);
  });
  return button;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function filterForm() {
  var date = document.getElementById("filter-data").value;
  const filteredCountries = await filterbyDate(current_page, date);
  DisplayCountries(filteredCountries);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function filterbyDate(page, date) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/countries?page=${page}&date=${date}`
  );
  const filtered = await response.json();
  return filtered.countires;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function sortData() {
  var container = document.getElementById("countries");
  var symb = document.getElementById("sort");
  var symb2 = document.createElement("span");
  if (symb.innerText == "∧") {
    container.removeChild(symb);
    symb2.setAttribute("id", "sort");
    symb2.setAttribute("onClick", "sortData()");
    symb2.innerText = "∨";
    const countries = await sortBy(current_page, "asc");
    DisplayCountries(countries);
  } else {
    container.removeChild(symb);
    symb2 = document.createElement("span");
    symb2.setAttribute("id", "sort");
    symb2.setAttribute("onClick", "sortData()");
    symb2.innerText = "∧";
    const countries = await sortBy(current_page, "desc");
    DisplayCountries(countries);
  }
  container.appendChild(symb2);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function sortBy(page, criteria) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/countries?page=${page}&order=${criteria}`
  );
  const sorted = await response.json();
  return sorted.countires;
}
