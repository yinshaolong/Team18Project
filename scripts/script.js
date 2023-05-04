function initMap() {
  const icon_marker = {
    url: "images/marker.jpg", // url
    scaledSize: new google.maps.Size(10, 10), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // anchor
  };
  const startLatLng = { lat: 49.2827, lng: -123.1207 };
  const options = {
    zoom: 8,
    center: startLatLng,
  };
  const map = new google.maps.Map(document.getElementById("map"), options);
  var marker = [];
  index = 0;
  google.maps.event.addListener(map, "click", function (event) {
    addMarker({ coords: event.latLng });
    marker.push({
      index: [{ lat: event.latLng.lat() }, { lng: event.latLng.lng() }],
    });
    index += 1;
    console.log(marker);
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
    var places = searchBox.getPlaces();
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
}

window.initMap = initMap;
