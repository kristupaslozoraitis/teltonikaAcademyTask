function FilterBySearch() {
  let input = document.getElementById("searchBar").value;
  input = input.toLowerCase();
  console.log(input);
  let item = document.getElementById("tbody");
  let rows = item.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    var td = rows[i].getElementsByTagName("td");
    for (let j = 0; j < td.length; j++) {
      if (td[j].innerText.toLowerCase().includes(input)) {
        rows[i].style.display = "";
        break;
      } else rows[i].style.display = "none";
    }
  }
}
