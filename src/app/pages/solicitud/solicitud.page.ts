import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';
import { v4 } from 'uuid';
import { FireService } from 'src/app/services/fire.service';
import { HomePage } from '../home/home.page';

declare var google;

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
})
export class SolicitudPage implements OnInit {

  mensaje = new FormGroup({
    rutX: new FormControl(''),
    message: new FormControl(''),
    id: new FormControl(''),
    rutY: new FormControl('')
  });

  KEY_VIAJES: any = "viajes";
  KEY_USUARIO = "usuarios";
  rut: any;
  rutpasajero: any;
  nombre: any;
  sesion: any = [];
  listado: any = [];
  datos: any;
  solicitud: any;
  usuario: any = [];
  template = 1;
  detalleViaje: any = [];

  elementType = 'canvas';
  value_qr = 'www.google.cl';
  mostrar_qr: any;

  receptorPas: any;
  emisorCond: any;
  largeMessage: any;
  messages: any = [];
  losMensajes: any = [];
  messageChatEspecifico: any = {
    rutX: '',
    rutY: '',
    messages: [
      {
        rut: '',
        message: ''
      }
    ]
  }

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private usuarioService: UsuarioService, private storage: StorageService
    , private router: Router, private toastController: ToastController, private fireStore: FireService, private home: HomePage) { }

  async ngOnInit() {
    let rut = this.route.snapshot.paramMap.get('rut');
    let id = await this.route.snapshot.paramMap.get('id');
    await this.fireStore.getDato(this.KEY_USUARIO, id).subscribe(
      (response: any) => {
        this.usuario = response.data();
      }
    );
    await this.fireStore.getDato(this.KEY_VIAJES, rut).subscribe(
      (response: any) => {
        this.detalleViaje = response.data();
      }
    );
    await this.fireStore.getDatos(this.KEY_VIAJES).subscribe(
      data => {
        for (let viaje of data) {
          let travel = viaje.payload.doc.data();
          this.listado.push(travel);
        }
        this.getListado(rut);
      }
    );
    await this.fireStore.getDatos("mensajes").subscribe(
      data => {
        for (let mensaje of data) {
          let message = mensaje.payload.doc.data();
          this.messages.push(message);
        }
      }
    )
  }


  async getListado(rut) {
    await this.listado.forEach(async (value, index) => {
      if (rut == value.rut_conductor) {
        this.solicitud = [...value.pasajeros];
      }
    });
  }

  async generarQr() {
    /* var nuevoQr = await this.storage.getDatoViaje(this.KEY_VIAJES, this.usuario.rut); */
    var nuevoQr = this.usuario;
    this.value_qr = nuevoQr.rut;
    this.mostrar_qr = nuevoQr.rut;
    console.log(this.mostrar_qr)
    this.template = 5;
  }

  async eliminarPasajeros(rutpasajero, rutSesion) {
    await this.storage.eliminarPasajero(this.KEY_VIAJES, this.usuario.rut, rutpasajero, this.listado);
    await this.ngOnInit();
    var alerta = "Pasajero eliminado";
    await this.toastError(alerta);
  }

  async iniciarViaje() {
    var rut = this.usuario.rut;
    await this.storage.inicioViaje(rut, this.listado);
    /*  this.detalleViaje = await this.storage.getDatoViaje(this.KEY_VIAJES, rut); */
    this.template = 2;
    var nuevoOrigen = this.detalleViaje.origen;
    var nuevoDestino = this.detalleViaje.destino;
    await this.buscarViaje(this.detalleViaje.rut_conductor);
    var map: HTMLElement = document.getElementById('map');
    this.mapa = await new google.maps.Map(map, {
      center: this.ubicacionDuoc,
      zoom: 13
    });
    await this.directionsRenderer.setMap(this.mapa);
    this.marker = await new google.maps.Marker({
      position: this.ubicacionDuoc,
      map: this.mapa
    });
    var request = {
      origin: nuevoOrigen,
      destination: nuevoDestino,
      travelMode: google.maps.TravelMode.DRIVING
    };
    await this.directionsService.route(request, async (respuesta, status) => {
      await this.directionsRenderer.setDirections(respuesta);
    });
    this.marker.setPosition(null);
    var alerta = "Viaje iniciado";
    await this.toastError(alerta);
  }
  async finalizarViaje(num) {
    var rut = this.usuario.rut;
    await this.storage.eliminarViaje(this.KEY_VIAJES, rut);
    this.template = num;
    var alerta = "Viaje eliminado";
    await this.toastError(alerta);
    await this.home.ngOnInit();
  }


  mapa: any;
  marker: any;
  search: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  ubicacionDuoc = { lat: 0, lng: 0 };
  ubicacionDos = { lat: -33.600379048832046, lng: -70.57719180496413 };
  dibujarMapa() {
    var map: HTMLElement = document.getElementById('map');
    this.mapa = new google.maps.Map(map, {
      center: this.ubicacionDuoc,
      zoom: 18
    });
    this.directionsRenderer.setMap(this.mapa);
    var indicaciones: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicaciones);
    this.marker = new google.maps.Marker({
      position: this.ubicacionDuoc,
      map: this.mapa
    });
  }
  agregarMarcador() {
    this.marker.setPosition(this.ubicacionDos);
    this.marker.setMap(this.mapa);
  }
  buscarDireccion(mapaLocal, marcadorLocal) {
    var autocomplete: HTMLElement = document.getElementById('autocomplete');
    const search = new google.maps.places.Autocomplete(autocomplete);
    this.search = search;
    search.addListener('place_changed', function () {
      var place = search.getPlace().geometry.location;
      mapaLocal.setCenter(place);
      mapaLocal.setZoom(15);
      marcadorLocal.setPosition(place);
    });
  }
  calcularRuta() {
    var place = this.search.getPlace().geometry.location;
    var request = {
      origin: this.ubicacionDuoc,
      destination: place,
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsService.route(request, (respuesta, status) => {
      this.directionsRenderer.setDirections(respuesta);
    });
    this.marker.setPosition(null);
  }
  getUbicacionActual(): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }
  async buscarViaje(identificador) {
    this.datos = await this.storage.getDatoViaje(this.KEY_VIAJES, identificador);
    console.log(this.datos);
    /* this.datos = this.detalleViaje; */
    return this.datos;
  }
  async toastError(alerta) {
    const toast = await this.toastController.create({
      message: alerta,
      duration: 3000
    });
    toast.present();
  }
  async volverMenu() {
    this.template = 1;
  }
  async cambiarChat(rutPas, idSesion) {
    this.emisorCond = idSesion;
    this.receptorPas = rutPas;
    await this.messages.forEach(element => {
      let prueba = 0;
      if (element.chat.rutX == rutPas && element.chat.rutY == idSesion || element.chat.rutY == rutPas && element.chat.rutX == idSesion) {

        console.log("entro:" + element.chat.messages);

        this.losMensajes = [...element.chat.messages];
        let i = 0;
        this.losMensajes.forEach(element => {
          console.log("xd: " + element.id);
          i = i + 1;
        });
        this.template = 6;
        console.log(i);
        this.largeMessage = i;
        console.log("no troleo o tal vez si xdxd")
        return;
      }
    });
      this.template = 6;

  }
  async enviarMensaje() {
    /* var guardar = await this.storage.agregar(this.KEY, this.alumno.value, existe); */
    this.mensaje.controls.rutX.setValue(this.emisorCond);
    this.mensaje.controls.rutY.setValue(this.receptorPas);
    let idDoc = this.emisorCond + "" + this.receptorPas;
    let creacion = {
      rut: this.mensaje.controls.rutX.value,
      message: this.mensaje.controls.message.value
    }
    await this.losMensajes.push(creacion);
    this.messageChatEspecifico = {
      rutX: this.emisorCond,
      rutY: this.receptorPas,
      messages: this.losMensajes
    };
    let chatEsp = {
      chat: this.messageChatEspecifico
    };
    await this.fireStore.modificar("mensajes", idDoc, chatEsp);
    await this.mensaje.reset();
    /* this.mensaje.controls.rutX.setValue(this.emisorCond);
    this.mensaje.controls.rutY.setValue(this.receptorPas);
    this.mensaje.controls.id.setValue(this.largeMessage+1);
    let id: string = "x"+this.mensaje.controls.rutX.value+''+this.mensaje.controls.rutY.value;
    console.log(this.mensaje.controls.id.value+" "+this.mensaje.controls.rutX.value+" "+this.mensaje.controls.rutY.value+" "+this.mensaje.controls.message.value);
    if(this.losMensajes != undefined){
      let creacion = {
        rut: this.mensaje.controls.rutX.value,
        message: this.mensaje.controls.message.value,
        id: this.largeMessage
      }
      await this.losMensajes.push(creacion);
      this.messageChatEspecifico = {
        rutX: this.emisorCond,
        rutY: this.receptorPas,
        messages: this.losMensajes
    };
    let chatEsp = {
      chat: this.messageChatEspecifico
    }
    await this.fireStore.agregar("mensajes",chatEsp, 'o')
    console.log(this.messageChatEspecifico);
    } else {
      this.losMensajes = [];
      let creacion = {
        rut: this.mensaje.controls.rutX.value,
        message: this.mensaje.controls.message.value,
        id: this.largeMessage
      };
      await this.losMensajes.push(creacion);
      this.messageChatEspecifico= {
        rutX: this.emisorCond,
        rutY: this.receptorPas,
        messages: this.losMensajes
    };
      let chatEsp = {
        chat: this.messageChatEspecifico
      }
    await this.fireStore.agregar("mensajes",chatEsp, 'o')
    console.log(this.messageChatEspecifico);
    } */
  }
  async recargar(){
    this.losMensajes = [];
    await this.ngOnInit();
    await this.cambiarChat(this.receptorPas, this.emisorCond);
  }
}







