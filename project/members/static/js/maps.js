import { RESTAURANTS, TOURIST_ATTRACTIONS, HOTELS } from "./placeTypes.js";
console.log(RESTAURANTS);
let places;
let MARKER_PATH;

function displayDropDown() {
  document.getElementById("dropdown").classList.toggle("display");
}

window.addEventListener("click", function (event) {
  if (!event.target.matches("#select-button")) {
    let dropdowns = document.getElementsByClassName("dropdown-buttons");
    for (dropdown of dropdowns) {
      let openDropDown = dropdown;
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
  var location_info = [];
  var index = 0;
  google.maps.event.addListener(map, "click", function (event) {
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
    string_coords = String(props.coords);
    coordinates = string_coords.split(", ");
    lat = coordinates[0].replace("(", "");
    lng = coordinates[1].replace(")", "");
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
        // clearResults();
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
          // addResult(results[i], i);
        }
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

window.initMap = initMap;

const googleMapsScript = document.createElement("script");
googleMapsScript.src =
  "https://maps.googleapis.com/maps/api/js?language=en&key=AIzaSyCEE6-JSPCe6zNZuAoIPog0ELD2-UyO3CM&libraries=places&callback=initMap&libraries=places&v=weekly";
document.body.appendChild(googleMapsScript);
