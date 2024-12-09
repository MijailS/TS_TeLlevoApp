import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NuevoviajePage } from "./nuevoviaje.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        NuevoviajePage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento nuevo viaje ', ()=>{
    const fixture = TestBed.createComponent(NuevoviajePage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});