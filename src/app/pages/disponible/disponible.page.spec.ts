import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DisponiblePage } from './disponible.page';

describe('PRUEBAS UNITARIAS: Disponible ', ()=>{
  // Configuracion ambiente de las pruebas:
    beforeEach ( async ()=> {
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          FormsModule
        ],
        declarations: [
          DisponiblePage 
        ]
      }).compileComponents;
    });
    it(' 1. Levantamiento Disponible ', ()=>{
      const fixture = TestBed.createComponent(DisponiblePage);
      const app = fixture.componentInstance;
      
      expect(app).toBeTruthy();
  
    });
  });