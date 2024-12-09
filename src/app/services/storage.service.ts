import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { FireService } from '../services/fire.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  dato: any[] = [];
  datos: any[] = [];
  nvoDato: any[] = [];
  isAuthenticated = new BehaviorSubject(false);
  userAdmin: any[] = [];
  constructor(private storage: Storage, private router: Router, private fireStore: FireService) {
    storage.create();
  }

  //MÉTODOS DEL CRUD DEL STORAGE:
  async agregar(key, dato, existe) {
    if (existe == undefined) {
      let nvoId = dato.id;
      await this.fireStore.agregar(key, dato, nvoId);
      return true;
    }
    return false;
  }
  async agregarViaje(key, dato, id) {
    /* this.datos = await this.storage.get(key) || [];
    this.datos.push(dato);
    await this.storage.set(key, this.datos); */
    await this.fireStore.agregar(key, dato, id);
    return true;
  }

  async agregarSolicitudes(key, dato) {
    this.datos = await this.storage.get(key) || [];
    this.datos.push(dato);
    await this.storage.set(key, this.datos);
  }
  async getDatoSolicitud(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    return this.datos.find(dato => dato.id == identificador);
  }

  async getDato(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    return this.datos.find(dato => dato.rut == identificador);
  }

  async getDatos(key) {
    this.datos = await this.storage.get(key) || [];
    return this.datos;
  }

 /*  async eliminar(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    this.datos.forEach((value, index) => {
      if (value.rut == identificador) {
        this.datos.splice(index, 1);
      }
    });
    await this.storage.set(key, this.datos);
  } */

  async eliminar(key, identificador, datos){
    let usu = datos.find(dato => dato.rut == identificador);
    await this.fireStore.eliminar(key, usu.id);
    await this.fireStore.eliminar("viajes", usu.rut);
  }

  async eliminarViaje(key, identificador) {
      await this.fireStore.eliminar(key, identificador);
    /*    this.datos = await this.storage.get(key) || [];
    this.datos.forEach((value, index) => {
      if (value.rut_conductor == identificador) {
        this.datos.splice(index, 1);
      }
    });
    await this.storage.set(key, this.datos); */

  }

  async actualizar(key, dato) {
   /*  this.datos = [];
    this.datos = await this.storage.get(key) || [];

    var index = this.datos.findIndex(value => value.id == dato.id);
    this.datos[index] = dato; */
    await this.fireStore.modificar(key, dato.id, dato);

   /*  await this.storage.set(key, this.datos); */
  }
  async guardarNuevoPasajero(rutConductor, datos) {
    this.datos = datos;
    var existe = await this.datos.find(viaje => viaje.rut_conductor == rutConductor);
    if (existe.pasajeros == "sin") {
      var creacion: any = {
        id: existe.id,
        origen: existe.origen,
        destino: existe.destino,
        precio: existe.precio,
        salida: existe.salida,
        iniciado: existe.iniciado,
        rut_conductor: existe.rut_conductor,
        capacidad: existe.capacidad,
        pasajeros: [],
      };
      /* var index = this.datos.findIndex(value => value.rut_conductor == rutConductor);
      this.datos[index] = creacion;
      await this.storage.set("viajes", this.datos); */
      await this.fireStore.modificar("viajes",creacion.id,creacion);
      return true;
    }
    return false;
  }


  async guardarPasajeroQr(idViaje, datos) {
    this.datos = datos;
    var existe = await this.datos.find(viaje => viaje.id == idViaje);
    if (existe.pasajeros == "sin") {
      var creacion: any = {
        id: existe.id,
        origen: existe.origen,
        destino: existe.destino,
        precio: existe.precio,
        salida: existe.salida,
        iniciado: existe.iniciado,
        rut_conductor: existe.rut_conductor,
        capacidad: existe.capacidad,
        pasajeros: [],
      };
      await this.fireStore.modificar("viajes",creacion.id,creacion);
      return true;
    }
    return false;
  }
  async inicioViaje(rutConductor, dato) {
    this.datos = dato;
    var existe = this.datos.find(viaje => viaje.rut_conductor == rutConductor);
    if (existe.iniciado == '0') {
      var creacion: any = {
        id: existe.id,
        origen: existe.origen,
        destino: existe.destino,
        precio: existe.precio,
        salida: existe.salida,
        iniciado: '1',
        rut_conductor: existe.rut_conductor,
        capacidad: existe.capacidad,
        pasajeros: existe.pasajeros,
      };
      await this.fireStore.modificar("viajes",existe.id, creacion);
     /*  var index = this.datos.findIndex(value => value.rut_conductor == rutConductor);
      this.datos[index] = creacion;
      await this.storage.set("viajes", this.datos); */
      return true;
    }
    return false;
  }

  async validarLogin(key, rut, password): Promise<any> {

    console.log(key);
    await this.fireStore.getDatos(key).subscribe(
      data => {
        for (let usuario of data) {
          let usu = usuario.payload.doc.data();
          usu['id'] = usuario.payload.doc.id;
          this.datos.push(usu);
          console.log(usu['id']);
          console.log(usuario.payload.doc.id);
        }
        var login = this.datos.find(usu => usu.rut == rut && usu.password == password);
        if (login != undefined) {
          console.log(2);
          this.isAuthenticated.next(true);
          return login;
        }
        else {
          console.log(3);
          return undefined;
        }
      }
    );
    /* var login = this.datos.find(usu => usu.rut == rut && usu.password == password); */

  }

  getAuth() {
    return this.isAuthenticated.value;
  }

  logout() {
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  async getPasajeros(key, conductor) {
    this.datos = await this.storage.get(key) || [];
    var dato = this.datos.find(dato => dato.viaje.rut_conductor == conductor);
  }
  /*   async existeAdmin() {
      var id = '0';
      this.datos = await this.storage.get("usuarios") || [];
      var existe = this.datos.find(admin => admin.id == id);
      if (existe == undefined) {
        console.log("crealo");
        this.datos = [{
          id: '0',
          rut: '20763231-7',
          nombre: 'Jose',
          apellido: 'Contreras',
          correo: 'rolando.hernandezv@duocuc.cl',
          fecha_nac: '01/04/2002',
          auto: 'no',
          vehiculo: 'undefined',
          password: '12341234',
          tipo_usuario: 'administrador'
        }];
        await this.storage.set("usuarios", this.datos);
        return false;
      }
      return true;

    } */
  async getDatoViaje(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    return this.datos.find(dato => dato.rut_conductor == identificador);
  }
  async devuelveDato(key, id){
    await this.fireStore.getDato(key, id).subscribe(
      (response: any) => {
        this.datos = response.data();
      }

    );
    return this.datos;
  }

  async getListaSolicitudes(key, identificador,) {
    this.datos = await this.storage.get(key) || [];
    return this.datos.find(dato => dato.id == identificador)
  }



  async eliminarPasajero(key, identificador, rutPasajero, dato) {
    this.datos = dato;
    await this.datos.forEach(async (value, index) => {
      if (value.rut_conductor == identificador) {
        this.nvoDato = value.pasajeros;

        await this.nvoDato.forEach(async(pasaje, indice) => {
          if (pasaje == rutPasajero) {
            this.nvoDato.splice(indice, 1);
            value.pasajeros = this.nvoDato;
            await this.fireStore.modificar(key, identificador, value);
          }
        });

      }

    }
    );
  }
  /*  async eliminar(key, identificador) {
     this.datos = await this.storage.get(key) || [];

     this.datos.forEach((value, index) => {
       if (value.rut == identificador) {
         this.datos.splice(index, 1);
       }
     });

     await this.storage.set(key, this.datos);
   } */
}
