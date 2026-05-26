// Esse arquivo integra um serviço gratuito que traduz texto (Av. Paulista 1000) para coordenadas. 
var NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
var USER_AGENT    = "HyperTech";
 
// Query => Texto digitado.
// Limit => Máximo de resultados (padrão: 5)
// Retorno => Uma Promise que carrega um array com os campos de display, lat e long.
async function buscarEnderecos(query, limit = 5) {
  var url = `${NOMINATIM_URL}?` +
    new URLSearchParams({
      q: `${query}, São Paulo, Brasil`,
      format: "json",
      limit,
      addressdetails: 1,
    });
 
  var response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
 
  if (!response.ok) {
    throw new Error(`Nominatim retornou status ${response.status}`);
  }
 
  var data = await response.json();
 
  return data.map((item) => ({
    display: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}
 
module.exports = { buscarEnderecos };