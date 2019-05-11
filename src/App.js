import React, { Component } from 'react';
import './App.css';



var data = {};
var uno = "2000-01-01 00:00:00";
var dos = "2019-09-31 00:00:00";
var mensajes = "0";
var flightPath = [];
var markersh = [];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      datos: [{}]
    }
  }



  componentDidMount() {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDYNzG1CYSeQy-CEC3qAXca5-cmj-Cd6ho&libraries=drawing&callback=initMap")
    window.initMap = this.processMap;
  }

  processMap = () => {
    //incialización el mapa
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 11.01947, lng: -74.85042 },
      zoom: 15

    })

    var drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        drawingModes: ['marker', 'circle']
      }
    });
    drawingManager.setMap(map);


    var circle = null;

    new window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      // event.setMap(null);
      event.overlay.setMap(null);
      if (event.type === 'circle') {
        var center = event.overlay.getCenter();
        circle = {
          radius: event.overlay.getRadius(),
          center: {
            lat: center.lat(),
            long: center.lng()
          },
          overLay: event.overLay
        }
      }

      var circleJson = { 'lat': circle.center.lat, 'lng': circle.center.long, 'rad': circle.radius };


      var R = 6378137;
      var latr = (Math.PI * circleJson.lat) / 180;
      var lngr = (Math.PI * circleJson.lng) / 180;

      var latmax = (180 / Math.PI) * Math.asin(Math.sin(latr) * Math.cos(circle.radius / R) + Math.cos(latr) * Math.sin(circle.radius / R));
      var latmin = (180 / Math.PI) * Math.asin(Math.sin(latr) * Math.cos(circle.radius / R) - Math.cos(latr) * Math.sin(circle.radius / R));
      var longmax = (180 / Math.PI) * (lngr + Math.atan2(Math.sin(circle.radius / R) * Math.cos(latr), Math.cos(circle.radius / R) - Math.sin(latr) * Math.sin(latr)));
      var longmin = (180 / Math.PI) * (lngr + Math.atan2(-Math.sin(circle.radius / R) * Math.cos(latr), Math.cos(circle.radius / R) - Math.sin(latr) * Math.sin(latr)));

      data = {
        start: uno,
        end: dos,
        hist: "Posicion",
        startlat: latmin.toString(),
        endlat: latmax.toString(),
        startlng: longmax.toString(),
        endlng: longmin.toString()
      }

      // 192.168.1.15
      // 192.168.1.41
      // 3.95.47.65 aws

      // fetch('http://192.168.1.41:4000/ubicacion', {
      fetch('http://3.95.47.65:4000/Hist', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(response => {
          console.log("Se hizo fetch")
          if (response[0].lng === undefined) {
            mensajes = "Sin resultados";
            this.setState({ datos: [{}] })
          } else {
            mensajes = "";
            console.log(response.data);
            poliforid(response);


          }
        })
        .catch(err => console.error(err))
    })

    var poliforid = function (jdatos) {

      let marker = null;
      let polvec = [];
      let polhis = [];
      let i = 0;
      let aid = null;

      let c = 0;
      jdatos.forEach(jdato => {
        if (i === 0) {
          aid = jdato.ID - 1;
        }
        polvec.push(new window.google.maps.LatLng(jdato.lat, jdato.lng));
        if (aid !== (jdato.ID - 1)) {
          polvec.pop();
          polhis.push(polvec);
          polvec = [];
          aid = jdato.ID - 1;
          c = 1;
        }
        aid = aid + 1;
        i = 1;
      });

      if (c === 0) {
        polhis.push(polvec);
      }
      flightPath = [];
      var color = null;

      var ii = 0;
      markersh = [];
      polhis.forEach(polvec => {
        var markerh = null;
        color = give_color();
        polvec.forEach(point => {
          var inf = 'El auto pasó por aquí el ' + jdatos[ii].Fecha;

          markerh = new window.google.maps.Marker({
            position: point,
            map: map,
            title: inf,
            icon: {
              url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
              size: new window.google.maps.Size(5, 5),
              anchor: new window.google.maps.Point(3, 3)
            }
          });
          markersh.push(markerh);
          ii = ii + 1;
        })


        let ft = new window.google.maps.Polyline({ path: polvec, strokeColor: color, strokeOpacity: 0.8, strokeWeight: 8 });
        ft.setMap(map);
        flightPath.push(ft);
      })

    }

    var aleatorio = function (inferior, superior) {
      let numPosibilidades = superior - inferior
      let aleat = Math.random() * numPosibilidades
      aleat = Math.floor(aleat)
      return parseInt(inferior) + aleat
    }

    var give_color = function () {
      let hexadecimal = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
      let color_aleatorio = "#";
      for (let i = 0; i < 6; i++) {
        let posarray = aleatorio(0, hexadecimal.length)
        color_aleatorio += hexadecimal[posarray]
      }
      return color_aleatorio
    }


    document.getElementById("butoon_borrar").addEventListener("click", function () {

      console.log("Evento");
      flightPath.forEach(ft => {
        ft.setMap(null);
        console.log("Borra");
      })
      markersh.forEach(mark => {
        mark.setMap(null);
        console.log("Borra");
      })

    });



  }

  render() {

    return (
      <main>
        <div>
          <input type="button" value="Borrar Cosas" id="butoon_borrar" />
        </div>
        <div id="map"></div>
      </main>
    );
  }
}


function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}


export default App;
