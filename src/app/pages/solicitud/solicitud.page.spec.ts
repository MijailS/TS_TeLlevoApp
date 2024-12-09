import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SolicitudPage } from "./solicitud.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        SolicitudPage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento solicitud ', ()=>{
    const fixture = TestBed.createComponent(SolicitudPage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});