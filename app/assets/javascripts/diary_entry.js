$(document).ready(function () {
  var LONGITUDE_MAX_VALUE = 180;
  var LONGITUDE_RANGE_WIDTH = 360;

  var marker, map;

  function setLocation(e) {
    $("#latitude").val(e.latlng.lat);
    $("#longitude").val(wrapLongitude(e.latlng.lng));

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker(e.latlng, {icon: OSM.getUserIcon()}).addTo(map)
      .bindPopup(I18n.t('diary_entry.edit.marker_text'));
  }

  function wrapLongitude(longitude) {
    if (longitude == LONGITUDE_MAX_VALUE) {
      return LONGITUDE_MAX_VALUE;
    } else {
      return wrapAroundRange(longitude, LONGITUDE_RANGE_WIDTH);
    }
  }

  /**
   * Wraps a number to fit within a range centred around 0.
   *
   * Inclusive at lower end of range, exclusive at top end.
   *
   * x - Number to wrap
   * width - Width of range
   */
  function wrapAroundRange(x, width) {
    var offset = width / 2;

    // If x is lower end of range, sign will return +1. (Math.sign would
    // return 0, which would make the final result 0, which is incorrect.)
    return sign(x + offset) * (Math.abs(x + offset) % width - offset);
  }

  function sign(x) {
    return (x == 0 ? +1 : Math.sign(x));
  }

  $("#usemap").click(function (e) {
    e.preventDefault();

    $("#map").show();
    $("#usemap").hide();

    var params = $("#map").data();
    var centre = [params.lat, params.lon];
    var position = $('html').attr('dir') === 'rtl' ? 'topleft' : 'topright';

    map = L.map("map", {
      attributionControl: false,
      zoomControl: false
    }).addLayer(new L.OSM.Mapnik());

    L.OSM.zoom({position: position})
      .addTo(map);

    map.setView(centre, params.zoom);

    if ($("#latitude").val() && $("#longitude").val()) {
      marker = L.marker(centre, {icon: OSM.getUserIcon()}).addTo(map)
        .bindPopup(I18n.t('diary_entry.edit.marker_text'));
    }

    map.on("click", setLocation);
  });
});
