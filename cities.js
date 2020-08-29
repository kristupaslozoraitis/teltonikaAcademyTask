const pageUrl = window.location.search;
const urlParams = new URLSearchParams(pageUrl);
const page_id = urlParams.get("id");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function GetCities(page) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/cities?page=${page}`
  );
  const cities = await response.json();
  return cities.cities;
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
function addCity(citiesCount) {
  if (citiesCount == 10) {
    current_page++;
  }
  fetch("https://akademija.teltonika.lt/api1/cities", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      name: document.getElementById("name-input").value,
      area: document.getElementById("area-input").value,
      population: document.getElementById("pop-input").value,
      postcode: document.getElementById("code-input").value,
      country_id: page_id,
    }),
  }).then(function (data) {
    if (data.status != 200) {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Nepavyko pridėti miesto";
    } else {
      var msg = document.getElementById("message");
      msg.style.display = "block";
      msg.innerText = "Miestas sėkmingai pridėtas";
    }
  });
  event.preventDefault();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function removeCity(id, countriesLength) {
  await fetch(`https://akademija.teltonika.lt/api1/cities/${id}`, {
    method: "DELETE",
  });
  if (countriesLength == 1) current_page--;
  initiate();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateCity(idd) {
  var data = {
    id: idd,
    name: document.getElementById("name-input").value,
    area: document.getElementById("area-input").value,
    population: document.getElementById("pop-input").value,
    postcode: document.getElementById("code-input").value,
    country_id: page_id,
  };
  fetch(`https://akademija.teltonika.lt/api1/cities/${idd}`, {
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
    `https://akademija.teltonika.lt/api1/cities?page=${page}`
  );
  const cities = await response.json();

  if (cities.cities.length > 0) {
    page++;
    console.log(page);
    await setMaxPages(page);
  } else pages = page - 1;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let rows = 10;
let current_page = 1;
var pages;
var tableBody = document.getElementById("tbody");
var pagination_wrapper = document.getElementById("pagination-wrapper");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function initiate() {
  const cities = await GetCities(current_page);
  DisplayCities(cities);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function DisplayCities(items) {
  await setMaxPages(1);
  while (pagination_wrapper.hasChildNodes()) {
    pagination_wrapper.removeChild(pagination_wrapper.firstChild);
  }
  if (pages > 1) {
    pagination(pagination_wrapper, rows);
  }
  var h = document.getElementById("cities-header");
  const country = await GetCountry(page_id);
  tableBody.innerHTML = "";
  h.innerText = country.name;
  var table = document.getElementById("allcities");
  const cities = items;
  if (cities.length > 0) {
    cities.forEach((city) => {
      if (city.country_id == page_id) {
        let row = document.createElement("tr");
        tableBody.appendChild(row);
        row.classList.add("items");
        let items = Object.values(city);
        for (let i = 1; i < 5; i++) {
          let cell = document.createElement("td");
          cell.setAttribute("id", `cell${i}`);
          let text = document.createTextNode(items[i]);
          cell.appendChild(text);
          row.appendChild(cell);
        }
        let trashcell = document.createElement("td");
        trashcell.innerHTML = `<img id='trash' src='trash.png' alt='trash' onClick='removeCity(${city.id}, ${cities.length})'/>`;
        let editcell = document.createElement("td");
        editcell.innerHTML = `<img id='edit-icon' src='Vector.png' alt='edit-icon' onClick='editCityForm(${city.id})'/>`;
        row.appendChild(trashcell);
        row.appendChild(editcell);
      }
    });
    table.appendChild(tableBody);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addCityForm() {
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
      name: "Miesto pašto kodas",
      nameId: "myCode",
      inputId: "code-input",
      divClass: "code-div",
    },
  ];
  var modal = document.getElementById("myModal");
  var modalcont = document.getElementById("modal-cont");
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
  formHeader.innerText = "PRIDĖTI MIESTĄ";
  modalcont.appendChild(formHeader);
  let form = document.createElement("form");
  form.setAttribute("id", "adding-form");
  form.setAttribute("onSubmit", `addCity(${tableBody.rows.length});`);
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
function editCityForm(id) {
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
      name: "Miesto pašto kodas",
      nameId: "myCode",
      inputId: "code-input",
      divClass: "code-div",
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
  formHeader.innerText = "REDAGUOTI MIESTĄ";
  modalcont.appendChild(formHeader);
  let form = document.createElement("form");
  form.setAttribute("id", "editting-form");
  form.setAttribute("onSubmit", `updateCity(${id})`);
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
async function pagination(wrapper) {
  const cities = await GetCities(current_page);
  wrapper.innerHTML = "";
  for (let i = 1; i < pages + 1; i++) {
    let btn = PaginationButton(i, cities);
    wrapper.appendChild(btn);
  }
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
    DisplayCities(items);
  });
  return button;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function sortData() {
  var container = document.getElementById("cities");
  var symb = document.getElementById("sort");
  var symb2 = document.createElement("span");
  if (symb.innerText == "∧") {
    container.removeChild(symb);
    symb2.setAttribute("id", "sort");
    symb2.setAttribute("onClick", "sortData()");
    symb2.innerText = "∨";
    const countries = await sortBy(current_page, "asc");
    DisplayCities(countries);
  } else {
    container.removeChild(symb);
    symb2 = document.createElement("span");
    symb2.setAttribute("id", "sort");
    symb2.setAttribute("onClick", "sortData()");
    symb2.innerText = "∧";
    const cities = await sortBy(current_page, "desc");
    DisplayCities(cities);
  }
  container.appendChild(symb2);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function sortBy(page, criteria) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/cities?page=${page}&order=${criteria}`
  );
  const sorted = await response.json();
  return sorted.cities;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function filterForm() {
  var date = document.getElementById("filter-data").value;
  const filteredCities = await filterbyDate(current_page, date);
  DisplayCities(filteredCities);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function filterbyDate(page, date) {
  const response = await fetch(
    `https://akademija.teltonika.lt/api1/cities?page=${page}&date=${date}`
  );
  const filtered = await response.json();
  return filtered.cities;
}
