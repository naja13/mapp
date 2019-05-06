import React, {Component} from 'react';
import './App.css';

class App extends Component {
  
  state = {
    datos: []
  }

  componentDidMount(){
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap")
    window.initMap = this.processMap;
    console.log(window.initMap);
  }


  processMap = () => {
    //incialización el mapa
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })

    var iconLink="https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png";
    Marker(-34.397,150.644,iconLink);
    Marker(-34.490,150.640);
    
    
    
    
    function Marker(lat,lng,iconLink) {
      var marker = new window.google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: 'Hello World!',
        icon:{
          url     : iconLink,
          size    : new window.google.maps.Size( 5, 5 ),
          anchor  : new window.google.maps.Point( 3, 3 )
        }
      });
    }

    

  }

  render(){
   
    return (
      <main>
        <div>
          <input type="button" ></input>
        </div>
        <div id="map"></div>
      </main>
    );
  }
}


function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}


export default App;
