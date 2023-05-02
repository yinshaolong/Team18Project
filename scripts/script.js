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
