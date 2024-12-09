import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { FireService } from 'src/app/services/fire.service';
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  KEY = "usuarios";
  rut: string;
  password: string;
  nuevorut: string;
  objectValidar:any [] = [];
  constructor(private toastController: ToastController, private router: Router,
    private usuarioService: UsuarioService, private route: ActivatedRoute, private navCtrl: NavController,
    private storage: StorageService, private loading: LoadingController, private fireStore: FireService) { }

 async ngOnInit() {

    await this.fireStore.getDatos(this.KEY).subscribe(
      data => {
        this.objectValidar = [];
        for (let usuario of data) {
          let usu = usuario.payload.doc.data();
          usu['id'] = usuario.payload.doc.id;
          this.objectValidar.push(usu);
        }
      }
    );
    await this.esperaEvento();
  }

  async login() {
   
    await this.storage.validarLogin(this.KEY, this.rut, this.password);
    var login = await this.objectValidar.find(usu => usu.rut == this.rut && usu.password == this.password);
    if (login != undefined) {
      await this.cargarPantalla();
      this.nuevorut = this.rut;
      this.password = '';
      this.rut = '';
      this.navCtrl.navigateForward(['/home/', this.nuevorut,login.id]);
    } else {
      await this.toastError();
    }
  }

  async toastError() {
    const toast = await this.toastController.create(
      {
        message: ' Usuario o contraseña incorrectos! ',
        duration: 3000
      }
    )
    toast.present();
  }

  async cargarPantalla() {
    const cargando = await this.loading.create(
      {
        message: 'Ingresando...',
        duration: 1000
      }
    );
    cargando.present();
  }

  async esperaEvento(){
    const cargando = await this.loading.create(
      {
        message: 'Cargando...',
        duration: 3000
      }
    );
    cargando.present();
  }
}
