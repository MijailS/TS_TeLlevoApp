import { TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfilPage } from "./perfil.page";


describe('PRUEBAS UNITARIAS: registro ', ()=>{
// Configuracion ambiente de las pruebas:
  beforeEach ( async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        PerfilPage
      ]
    }).compileComponents;
  });
  it(' 1. Levantamiento perfil ', ()=>{
    const fixture = TestBed.createComponent(PerfilPage);
    const app = fixture.componentInstance;
    
    expect(app).toBeTruthy();

  });
});