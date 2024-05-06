import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  idProducto: string = "";
  productoSeleccionado: Producto;

  constructor(private router: Router, private activateRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    // Almacennamos el id del producto en una propiedad de la clase
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if(idRecibido!= null){
      this.idProducto = idRecibido;
    }
  }

  public actualizaProducto(){
    this.firestoreService.actualizar("productos", this.idProducto, this.productoSeleccionado)
    .then(()=>{
      this.productoSeleccionado = {} as Producto;
    });
    // redirigimos a home
    this.router.navigate(['home']);

  }

  public clickBorrar(){
    this.firestoreService.borrar("productos", this.idProducto)
    .then(()=>{
      // Limpiamos los datos en pantalla
      this.idProducto = null;
      this.productoSeleccionado = {} as Producto;
    });
        // redirigimos a home
        this.router.navigate(['home']);
  }

  public clickCancelar(){
    this.idProducto = null;
    this.productoSeleccionado = {} as Producto;
  }

}
