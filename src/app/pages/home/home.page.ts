import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { FireService } from 'src/app/services/fire.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  //variable de pruebas unitarias:

  api: any [] = [];
  rut: any;
  sesion: any = [];
  tiene_viaje: any = [];
  KEY = "usuarios";
  KEY_VIAJE = "viajes";
  constructor(private router: Router, private route: ActivatedRoute, private usuarioService: UsuarioService,
    private navCtrl: NavController, private storage: StorageService, private fireStore: FireService) { }

  async ngOnInit() {

   
   
    let rut = await this.route.snapshot.paramMap.get('rut');
    let id = await this.route.snapshot.paramMap.get('id');
    await this.fireStore.getDato(this.KEY, id).subscribe(
      (response: any) => {
        this.sesion = response.data();
      }
    );
    await this.fireStore.getDato(this.KEY_VIAJE, rut).subscribe(
      (response: any) => {
        this.tiene_viaje = response.data();
      }
    );
    /* this.tiene_viaje = await this.storage.getDatoViaje(this.KEY_VIAJE, rut); */
  }
  async recargar(rut) {
    /* this.sesion = await this.storage.getDato(this.KEY, rut); */
    await this.fireStore.getDato(this.KEY, this.sesion.id).subscribe(
      (response: any)=>{
        this.sesion = response.data();
      }
    )
  }

  async cerrarSesion() {
    await this.storage.logout();
  }
  /*
    perfil(rut, id) {
      this.navCtrl.navigateForward(['/perfil', rut,id]);
    }
    administrar(rut,id) {
      this.navCtrl.navigateForward(['/administrar', rut,id]);
    }
    async recargar(rut) {
      this.sesion = await this.storage.getDato(this.KEY, rut);
    }

    irCrearViaje() {
      var session = this.sesion;
      var navExtras: NavigationExtras = {
        state: {
          usuario: session
        }
      };
      //funciona
      console.log(navExtras.state.usuario.rut);
      this.router.navigate(['/recorrido'], navExtras);
    }

    irSolicitudViaje() {
      this.router.navigate(['/solicitud']);
    }
   */


}
