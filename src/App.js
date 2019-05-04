import React, {Component} from 'react';
import './App.css';

class App extends Component {
  
  state = {
    datos: []
  }

  componentDidMount(){
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap")
    window.initMap = this.initMap;
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })






    this.getData();
    this.interval = setInterval(() =>{
       this.getData();
       console.log(this.state.datos);
      }
       , 5000);
    
    var marker = new window.google.maps.Marker({
      position: {lat: -34.397, lng: 150.644},
      map: map,
      title: 'Hello World!'
    });
  }
  

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData = _ => {
    fetch('http://3.95.47.65:4000')
      .then(response => response.json())
      .then(response => this.setState({ datos: response.data }))
      .catch(err => console.error(err))
  }

  render(){
   
    return (
      <main>
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
