import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  idProducto: string = "";
  productoSeleccionado: any = {
    id: "",
    data: {} as Producto
  };

  constructor(private router: Router, private activateRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    // Almacennamos el id del producto en una propiedad de la clase
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.idProducto = idRecibido;
    }

    this.cargarProducto();
  }

  cargarProducto() {
    this.firestoreService.getProducto("productos", this.idProducto).subscribe((resultado: any) => {
      if (resultado.payload.data() != null) {
        this.productoSeleccionado.id = resultado.payload.id;
        this.productoSeleccionado.data = resultado.payload.data();
        // mostramos algo por consola
        console.log(this.productoSeleccionado.data.titulo);
      } else {
        this.productoSeleccionado.data = {} as Producto;
      }
    })
  }

  public actualizaProducto() {
    this.firestoreService.actualizar("productos", this.productoSeleccionado.id, this.productoSeleccionado.data)
      .then(() => {
        this.productoSeleccionado = {} as Producto;
      });

    // redirigimos a home
    this.router.navigate(['home']);

  }

  public clickBorrar() {
    this.firestoreService.borrar("productos", this.idProducto)
      .then(() => {
        // Limpiamos los datos en pantalla
        this.idProducto = null;
        this.productoSeleccionado = {} as Producto;
      });
    // redirigimos a home
    this.router.navigate(['home']);
  }

  public clickCancelar() {
    this.idProducto = "";
    this.productoSeleccionado = {} as Producto;
    // redirigimos a home
    this.router.navigate(['home']);
  }

  public clickInsertar(){
    this.firestoreService.insertar("productos", this.productoSeleccionado)
    .then(()=>{
      console.log("Nuevo producto instertado");
      // Limpiamos el contenido del producto en edición
      this.productoSeleccionado = {} as Producto;
    }, (error) => {
      console.log(error);
    });
  }

}
