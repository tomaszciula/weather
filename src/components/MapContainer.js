import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import "../App.css";

const MapContainer = () => {
  const [currentPosition, setCurrentPosition] = useState({});

  const success = (position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  });

  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const defaultCenter = {
    lat: 41.3851,
    lng: 2.1734,
  };
  let position = { lat: defaultCenter.lat, lng: defaultCenter.lng };

  const onLoad = (infoWindow) => {
    console.log("infoWindow: ", infoWindow);
  };

  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
  };

  let weatherForCoords;
  /*
  function handleOnClick(ev) {
    console.log("Kliknięto");
    console.log("latitide = ", ev.latLng.lat());
    console.log("longitude = ", ev.latLng.lng());
    setCurrentPosition({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
 //   let position = currentPosition
  }
  */

  return (
    <div className="container">
      <div className="mapContainer__container">
        <LoadScript googleMapsApiKey="AIzaSyDe5En4PiofzCWYeRbJOY_PFn-KE_eHXoY">
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
            center={defaultCenter}
            onClick={(ev) => {
              console.log("latitide = ", ev.latLng.lat());
              console.log("longitude = ", ev.latLng.lng());

              axios
                .get(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${ev.latLng.lat()}&lon=${ev.latLng.lng()}&appid=1ed9d85540c90a79ef1df445946c7c4e`
                )
                .then((response) => {
                  weatherForCoords = response.data;
                  console.log(weatherForCoords);
                  console.log("Dane odebrano poprawnie");
                  console.log("zmienna zawiera: ", weatherForCoords);
                })
                .catch(function (error) {
                  console.log(error);
                });
              axios
                .post("http://localhost:4000/weather/add", weatherForCoords)
                .then((res) => console.log("Dodano poprawnie do bazy danych "));
            }}
          >
            <InfoWindow onLoad={onLoad} position={position}>
              <div style={divStyle}>
                <h1>
                  Lat: {currentPosition.lat}, lng: {currentPosition.lng}
                </h1>
              </div>
            </InfoWindow>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default React.memo(MapContainer);
