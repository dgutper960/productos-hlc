import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CallNumber } from '@awesome-cordova-plugins/call-number';

import * as L from 'leaflet';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  map: any;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('pagina info');
  }

  volver() {

    // redirigimos a home
    this.router.navigate(['home']);
  }

  async call() {
    await CallNumber.callNumber("666999333", true);
  }

  // Funciones del mapa

  ionViewDidEnter(){
    this.loadMap();
  }

  loadMap() {
    let latitud = 36.67220715606298; 
    let longitud = -5.4486584750121185; 
    let zoom = 19; // El zoom máximo es 19
  
    // Inicializar el mapa
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, 
    }).addTo(this.map);
    
    // Añadir un marcador en las coordenadas
    L.marker([latitud, longitud]).addTo(this.map)
      .bindPopup('Ubicación del Negocio')
      .openPopup();
  }  
  

}
