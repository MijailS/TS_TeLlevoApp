import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecuperarPage } from "./recuperar.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        RecuperarPage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento recuperar ', ()=>{
    const fixture = TestBed.createComponent(RecuperarPage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});