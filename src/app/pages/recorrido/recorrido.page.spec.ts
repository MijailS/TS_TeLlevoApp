import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecorridoPage } from "./recorrido.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        RecorridoPage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento recorrido ', ()=>{
    const fixture = TestBed.createComponent(RecorridoPage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});