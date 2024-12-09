import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetallePage } from './detalle.page';


describe('PRUEBAS UNITARIAS: Detalle ', ()=>{
  // Configuracion ambiente de las pruebas:
    beforeEach ( async ()=> {
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          FormsModule
        ],
        declarations: [
          DetallePage
        ]
      }).compileComponents;
    });
    it(' 1. Levantamiento registro ', ()=>{
      const fixture = TestBed.createComponent(DetallePage);
      const app = fixture.componentInstance;
      
      expect(app).toBeTruthy();
  
    });
  });