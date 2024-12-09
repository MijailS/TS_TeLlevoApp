import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NuevoautoPage } from './nuevoauto.page';

describe('PRUEBAS UNITARIAS: Nuevo Auto ', ()=>{
    // Configuracion ambiente de las pruebas:
      beforeEach ( async ()=> {
        await TestBed.configureTestingModule({
          imports: [
            ReactiveFormsModule,
            FormsModule
          ],
          declarations: [
            NuevoautoPage
          ]
        }).compileComponents;
      });
      it(' 1. Levantamiento Nuevo auto ', ()=>{
        const fixture = TestBed.createComponent(NuevoautoPage);
        const app = fixture.componentInstance;
        
        expect(app).toBeTruthy();
    
      });
    });