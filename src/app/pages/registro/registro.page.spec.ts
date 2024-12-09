import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistroPage } from "./registro.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        RegistroPage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento registro ', ()=>{
    const fixture = TestBed.createComponent(RegistroPage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});