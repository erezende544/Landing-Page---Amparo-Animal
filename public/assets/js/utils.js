export const API_URL = "https://api-amparo-animal.azurewebsites.net/";

function maskCNPJ(event) {
  let value = event.target.value;
  value = value.replace(/\D/g, ""); // Remove não-dígitos
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  event.target.value = value;
}
