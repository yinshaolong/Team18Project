import { RESTAURANTS, TOURIST_ATTRACTIONS, HOTELS } from "./placeTypes.js";
console.log(RESTAURANTS);
let itenarary_saves = [];
let places;
let markers = [];
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";

function displayDropDown() {
  document.getElementById("dropdown").classList.toggle("display");
}
// edited by ram \/ 
window.addEventListener("click", function (event) {
  if (!event.target.matches("#select-button")) {
    let dropdowns = document.getElementsByClassName("dropdown-buttons");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropDown = dropdowns[i];
      if (openDropDown.classList.contains("display")) {
        openDropDown.classList.remove("display");
      }
    }
  }
});


document
  .getElementById("select-button")
  .addEventListener("click", displayDropDown);

function initMap() {
  const startLatLng = { lat: 49.2827, lng: -123.1207 };
  const options = {
    zoom: 14,
    center: startLatLng,
  };
  const map = new google.maps.Map(document.getElementById("map"), options);
  places = new google.maps.places.PlacesService(map);
  // console.log(">>> places", places.getDetails());
  var location_info = [];
  var index = 0;
  google.maps.event.addListener(map, "click", function (event) {
    console.log(">>> event", event);
    addMarker({ coords: event.latLng });
    location_info.push({
      index: [{ lat: event.latLng.lat() }, { lng: event.latLng.lng() }],
    });
    index += 1;
    console.log(location_info);
  });

  //search bar
  var input = document.getElementById("search");
  var searchBox = new google.maps.places.SearchBox(input);
  //makes sure that the search is only limited to the bounds of the map box
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  searchBox.addListener("places_changed", function () {
    let places = searchBox.getPlaces();
    //if array is empty dont want to do any other work with places
    if (places.length === 0) {
      return;
    }
    //takes callback function taking the curernt marker for that iteration and using null to get rid of the map reference
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    //re-init to an empty array
    markers = [];

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        return;
      }
      markers.push(
        new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location,
          // content: "testing",
          content: `lat: ${place.geometry.location.lat()} <br> lng: ${place.geometry.location.lng()}`,
        })
      );

      console.log("coordinates", place.geometry.location.lat());
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    markers.forEach((marker) => {
      var infoWindow = new google.maps.InfoWindow({
        //  content: "lat: " + lat + "<br/>lng: " + lng,
        content: marker.content,
      });
      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
      location_info.push({
        index: [{ lat: marker.lat }, { lng: marker.lng }],
      });
      index += 1;
      console.log(location_info);
    });
    map.fitBounds(bounds);
  });

  function addMarker(props) {
    console.log("this is props" + props.coords);
    let string_coords = String(props.coords);
    let coordinates = string_coords.split(", ");
    let lat = coordinates[0].replace("(", "");
    let lng = coordinates[1].replace(")", "");
    console.log("lng is " + lng + " and lat is " + lat);
    var marker = new google.maps.Marker({
      position: props.coords,
      map,
    });
    //check content
    var infoWindow = new google.maps.InfoWindow({
      content: "lat: " + lat + "<br/>lng: " + lng,
    });

    marker.addListener("click", function () {
      infoWindow.open(map, marker);
    });
  }
  //credit: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
  function showInfoWindow() {
    // @ts-ignore
    const marker = this;

    places.getDetails(
      { placeId: marker.placeResult.place_id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }

        infoWindow.open(map, marker);
        buildIWContent(place);
      }
    );
  }

  function dropMarker(i) {
    return function () {
      markers[i].setMap(map);
    };
  }

  function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }

    markers = [];
  }

  function search(type) {
    console.log("in search");
    const search = {
      bounds: map.getBounds(),
      types: [type],
    };
    places.nearbySearch(search, (results, status, pagniation) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        console.log(results);
        clearResults();
        clearMarkers();
        for (let i = 0; i < results.length; i++) {
          const markerLetter = String.fromCharCode(
            "A".charCodeAt(0) + (i % 26)
          );
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            // icon: markerIcon,
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          // @ts-ignore TODO refactor to avoid storing on marker
          markers[i].placeResult = results[i];
          google.maps.event.addListener(markers[i], "click", showInfoWindow);
          setTimeout(dropMarker(i), i * 100);
          addResult(results[i], i);
        }
        console.log(">> saves", itenarary_saves);
      }
    });
  }

  let restaurantButton = document.getElementById("restaurants");
  let hotelsButton = document.getElementById("hotels");
  let touristAttractionsButton = document.getElementById("tourist_attractions");
  restaurantButton.addEventListener("click", () => search(RESTAURANTS));
  hotelsButton.addEventListener("click", () => search(HOTELS)); //
  touristAttractionsButton.addEventListener("click", () =>
    search(TOURIST_ATTRACTIONS)
  );
}

//credit: https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-hotelsearch
function clearResults() {
  const results = document.getElementById("results");

  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function addResult(result, i) {
  const results = document.getElementById("results");
  const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
  const markerIcon = MARKER_PATH + markerLetter + ".png";
  const tr = document.createElement("tr");

  tr.style.backgroundColor = i % 2 === 0 ? "#F6E0B3" : "#FFFFE0";
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], "click");
  };

  const iconTd = document.createElement("td");
  const nameTd = document.createElement("td");
  const icon = document.createElement("img");
  const button = document.createElement("button");
  button.innerText = "Add";
  icon.src = markerIcon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");

  const name = document.createTextNode(result.name);
  let itenarary_item = getLocationInfo(result);
  // console.log(itenarary_item);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
  tr.appendChild(button);
  button.addEventListener("click", () => handleSave(itenarary_item));
}
function handleSave(itenarary_item) {
  itenarary_saves.push(itenarary_item);
  const list = document.getElementById("list");
  const div = document.createElement("div");
  const p = document.createElement("p");
  for (let key in itenarary_item) {
    p.innerHTML += `<strong><u>${key}</strong>: ${itenarary_item[key]} <br>`;
  }
  div.appendChild(p);
  // div.appendChild(new_line);
  div.className = "itenarary_item";
  list.appendChild(div);
}
function getLocationInfo(location) {
  return {
    name: location.name,
    address: location.vicinity,
    type: location.types[0],
    rating: location.rating,
  };
}
window.initMap = initMap;

function saveBusinesses() { 
  console.log("Save button has been clicked");
  let businessData = itenarary_saves;
  fetch('/business/new/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(businessData)
  })
    .then(response => response.json())
    .then(result => {
      // Handle the response from the Django backend
      console.log(result);
      itenarary_saves = []; // Clear the array
      businessData = [];
      var businesses = document.getElementsByClassName('itenarary_item');
      while (businesses.length > 0) {
        businesses[0].remove();
      }
    })
    .catch(error => {
      // Handle any errors
      console.error('Error:', error);
    });
}
  
  
const businessSaveButton = document.getElementById("save-button");
businessSaveButton.addEventListener("click", saveBusinesses);
  
const googleMapsScript = document.createElement("script");
googleMapsScript.src =
  "https://maps.googleapis.com/maps/api/js?language=en&key=AIzaSyCEE6-JSPCe6zNZuAoIPog0ELD2-UyO3CM&libraries=places&callback=initMap&libraries=places&v=weekly";
document.body.appendChild(googleMapsScript);
