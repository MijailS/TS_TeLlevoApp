import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdministrarPage } from './administrar.page';

describe('PRUEBAS UNITARIAS: Administrar ', ()=>{
    // Configuracion ambiente de las pruebas:
      beforeEach ( async ()=> {
        await TestBed.configureTestingModule({
          imports: [
            ReactiveFormsModule,
            FormsModule
          ],
          declarations: [
            AdministrarPage
          ]
        }).compileComponents;
      });
      it(' 1. Levantamiento Administrar', ()=>{
        const fixture = TestBed.createComponent(AdministrarPage);
        const app = fixture.componentInstance;
        
        expect(app).toBeTruthy();
    
      });
    });