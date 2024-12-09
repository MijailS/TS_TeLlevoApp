import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
declare var google;
@Component({
  selector: 'app-disponible',
  templateUrl: './disponible.page.html',
  styleUrls: ['./disponible.page.scss'],
})
export class DisponiblePage implements OnInit {
  mensaje = new FormGroup({
    rutX: new FormControl(''),
    message: new FormControl(''),
    id: new FormControl(''),
    rutY: new FormControl('')
  });
  constructor(private fireStore: FireService, private router: Router, private route: ActivatedRoute, private usuarioService: UsuarioService, private storage: StorageService, private toastController: ToastController) { }
  //Variables disponible
  template = 1;
  pasajesSolicitados: any = [];
  idPasaje: any[] = [];
  solicitud: any;
  detalle: any = [];
  usuario: any = [];
  usuarios: any = [];
  viajes: any[] = [];
  total: any = [];
  rut: any
  KEY_VIAJE = "viajes";
  KEY_USUARIO = "usuarios";
  message: any = 0;
  titulo = "Viajes Disponibles";
  idViajes: any;
  //Variables detalle
  idImportante: any;
  mapa: any;
  marker: any;
  search: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  inicio: any;
  final: any;
  datos: any;
  ///
  api: any;
  precio: any;
  dolar: any;
  /* waypoints = WayPoint [] = */  /* DESCOMENTAR CUANDO SE CARGUEN EN LOS WAYPOINTS PARA TRAZAR LA RUTA DE LOS OTROS VIAJES INTEGRANDO EL LOCALSTORAGE SEGUN DONDE VAN LOS PASAJEROS */
  ubicacionDuoc = { lat: 0, lng: 0 };
  ubicacionDos = { lat: -33.600379048832046, lng: -70.57719180496413 };
  KEY: any = "viajes";


  /* Métodos chat */
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

  /* métodos disponible */
  async ngOnInit() {

    this.usuario = [];
    this.usuarios = [];
    this.viajes = [];

    let rut = await this.route.snapshot.paramMap.get('rut');

    this.receptorPas = rut;
    let id = await this.route.snapshot.paramMap.get('id');
    this.idImportante = id;
    await this.fireStore.getDato(this.KEY_USUARIO, id).subscribe(
      (response: any) => {
        this.usuario = response.data();
      }
    );
    await this.fireStore.getDatos(this.KEY_USUARIO).subscribe(
      data => {
        for (let usuario of data) {
          let user = usuario.payload.doc.data();
          this.usuarios.push(user);
        }
      }
    )
    await this.fireStore.getDatos(this.KEY).subscribe(
      data => {
        this.total = [];
        for (let viaje of data) {
          let travel = viaje.payload.doc.data();
          this.viajes.push(travel);
        }
        this.viajes.forEach(async (value, index) => {
          let chofer = await this.usuarios.find(usu => usu.rut == value.rut_conductor);
          await this.fireStore.getDato(this.KEY_USUARIO, chofer.id).subscribe(
            (response: any) => {
              var interna = response.data();
              var arreglo = {
                precios: value,
                dato: interna
              };
              this.total.push(arreglo);
            }
          );
        });
      }

    );
    await this.TraerApi();
    await this.fireStore.getDatos("mensajes").subscribe(
      data => {
        for (let mensaje of data) {
          let message = mensaje.payload.doc.data();
          this.messages.push(message);
        }
      }
    );
    return true;
  }
  async cargarDatoMensaje() {

    await this.fireStore.getDatos("mensajes").subscribe(
      data => {
        for (let mensaje of data) {
          let message = mensaje.payload.doc.data();
          this.messages.push(message);
        }
      }
    );

    await this.cambiarChat(this.receptorPas, this.emisorCond);
    await this.cambiarChat(this.receptorPas, this.emisorCond);
    await this.cambiarChat(this.receptorPas, this.emisorCond);
  }/*
  async cargarDatoMensajes(rutPas, idSesion) {

    await this.fireStore.getDatos("mensajes").subscribe(
      data => {
        for (let mensaje of data) {
          let message = mensaje.payload.doc.data();
          this.messages.push(message);
        }

      }

    );


  } */


  async irDetalle(rut) {
    await this.total.forEach(async (value, index) => {
      if (value.dato.rut == rut) {
        this.template = 2;
        var detalleViaje = value;
        this.detalle = detalleViaje;
        var nuevoOrigen = value.precios.origen;
        var nuevoDestino = value.precios.destino;
        this.precio = value.precios.precio
        console.log(typeof this.precio)
        this.calcularDolar(this.precio)
        await this.buscarViaje(rut);
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
      };
    });
  }
  async irQr() {
    this.template = 3;
  }
  async leerQr() {
    var user = this.usuario.rut;
    this.idPasaje = [];
    this.idPasaje = this.viajes;
    await this.storage.guardarPasajeroQr(this.idViajes, this.idPasaje);

    this.idPasaje.forEach(async (value, index) => {
      if (this.idViajes == value.id) {
        var nuevaCapacidad = value.capacidad - 1;

        if (nuevaCapacidad >= 0) {

          this.solicitud = [...value.pasajeros];
          this.solicitud.push(user);
          var creacion: any = {
            id: value.id,
            origen: value.origen,
            destino: value.destino,
            precio: value.precio,
            salida: value.salida,
            iniciado: value.iniciado,
            rut_conductor: value.rut_conductor,
            capacidad: nuevaCapacidad,
            pasajeros: this.solicitud,
          };
          await this.storage.actualizar(this.KEY_VIAJE, creacion);
          await this.recargar();
          this.template = 1;
          this.titulo = "Viaje Solicitado";
          var alerta = "Viaje Solicitado";
          await this.toastError(alerta);

        } else {
          var error = 'Viaje sin capacidad'
          this.toastError(error)
          return;
        }

      }
    });
  }
  /* métodos detalle */
  async irViajes() {
    this.template = 1;
  }

  async volverMenu() {
    this.template = 1;
  }
  async irSolicitar(rut) {
    this.idPasaje = [];
    var user = this.usuario.rut;
    this.idPasaje = this.viajes;
    await this.storage.guardarNuevoPasajero(rut, this.idPasaje);
    await this.idPasaje.forEach(async (value, index) => {
      if (rut == value.rut_conductor) {
        var nuevaCapacidad = value.capacidad - 1;
        this.solicitud = [...value.pasajeros];
        this.solicitud.push(user);
        var creacion: any = {
          id: value.id,
          origen: value.origen,
          destino: value.destino,
          precio: value.precio,
          salida: value.salida,
          iniciado: value.iniciado,
          rut_conductor: value.rut_conductor,
          capacidad: nuevaCapacidad,
          pasajeros: this.solicitud,
        };
        await this.storage.actualizar(this.KEY_VIAJE, creacion);
        await this.recargar();
        this.template = 1;
        this.titulo = "Viaje Solicitado";
        var alerta = "Viaje Solicitado";
        await this.toastError(alerta);
        await this.recargar();
      }
    });


  }
  async recargar() {
    this.usuario = [];
    this.usuarios = [];
    this.viajes = [];
    this.total = [];
  }
  async dibujarMapa() {
    var map: HTMLElement = document.getElementById('map');
    this.mapa = await new google.maps.Map(map, {
      center: this.ubicacionDuoc,
      zoom: 13
    });
    await this.directionsRenderer.setMap(this.mapa);
    var indicaciones: HTMLElement = await document.getElementById('indicaciones');
    await this.directionsRenderer.setPanel(indicaciones);
    this.marker = await new google.maps.Marker({
      position: this.ubicacionDuoc,
      map: this.mapa
    });
  }

  async agregarMarcador() {
    await this.marker.setPosition(this.ubicacionDos);
    await this.marker.setMap(this.mapa);
  }

  async calcularRuta() {
    var place = await this.search.getPlace().geometry.location;
    var request = {
      origin: this.ubicacionDuoc,
      destination: place,
      travelMode: google.maps.TravelMode.DRIVING
    };

    await this.directionsService.route(request, async (respuesta, status) => {
      await this.directionsRenderer.setDirections(respuesta);
    });

    await this.marker.setPosition(null);
  }
  async getUbicacionActual(): Promise<any> {
    return new Promise(
      async (resolve, reject) => {
        await navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }
  async buscarViaje(identificador) {
    this.datos = await this.storage.getDatoViaje(this.KEY, identificador);
  }
  async toastError(alerta) {
    const toast = await this.toastController.create({
      message: alerta,
      duration: 5000
    });
    toast.present();
  }


  async TraerApi() {


    try {
      let Apis = await this.fireStore.api();
      Apis.subscribe((data: any) => {
        this.api = data.serie[0].valor;



        console.log(this.api)
      })

    } catch (error) {
    }

  }

  async calcularDolar(precio) {

    var dolar = this.api
    this.dolar = (precio / dolar).toFixed(2)

    console.log(precio)
    console.log(this.dolar)

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
    console.log("troleo xdxdxd")
    this.template = 6;
    /* this.messageChatEspecifico = {
      rutX: idSesion,
      rutY: rutPas,
      messages: [
        {
          rut: 'default',
          message: 'default'
        }
      ]
    };
    this.template = 6;
    this.largeMessage = 1;
    let chatEsp = {
      chat: this.messageChatEspecifico
    }
    let idDoc = idSesion + "" + rutPas;
    this.fireStore.agregar("mensajes", chatEsp, idDoc); */

  }
  async enviarMensaje() {
    /* var guardar = await this.storage.agregar(this.KEY, this.alumno.value, existe); */
    this.mensaje.controls.rutX.setValue(this.emisorCond);
    this.mensaje.controls.rutY.setValue(this.receptorPas);
    let idDoc = this.emisorCond + "" + this.receptorPas;
    let creacion = {
      rut: this.mensaje.controls.rutY.value,
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
  }
  async recargarChat() {
    this.losMensajes = [];
    await this.cargarDatoMensaje();

  }
}
