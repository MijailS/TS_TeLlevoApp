import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
describe('PRUEBAS UNITARIAS: Home ', ()=>{
  // Configuracion ambiente de las pruebas:
    beforeEach ( async ()=> {
      await TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          FormsModule
        ],
        declarations: [
          HomePage
        ]
      }).compileComponents;
    });
    it(' 1. Levantamiento Home ', ()=>{
      const fixture = TestBed.createComponent(HomePage);
      const app = fixture.componentInstance;
      
      expect(app).toBeTruthy();
  
    });
  });