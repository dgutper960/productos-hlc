import { Component } from '@angular/core';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  productoEditando: Producto;
  arrayProductos: any = [{
    id: "",
    data: {} as Producto
  }];

  idProductoSelect: string;

  constructor(private router: Router, private firestoreService: FirestoreService) {
    // Creamos producto vacio
    this.productoEditando = {} as Producto;

    // Cargamos la lista de productos al inicio
    this.cargarListaProductos();
  }

  public clickInsertar(){
    this.firestoreService.insertar("productos", this.productoEditando)
    .then(()=>{
      console.log("Nuevo producto instertado");
      // Limpiamos el contenido del producto en edición
      this.productoEditando = {} as Producto;
    }, (error) => {
      console.log(error);
    });
  }

  public cargarListaProductos(){
    this.firestoreService.consultar("productos").subscribe((result) =>{
      this.arrayProductos = [];
      result.forEach((datosProducto: any)=>{
        this.arrayProductos.push({
          id: datosProducto.payload.doc.id,
          data: datosProducto.payload.doc.data()
        });
      });
    })
  }

  public selecProducto(producto: any){
    this.idProductoSelect = producto.id;
    this.productoEditando.nombre = producto.data.nombre;
    this.productoEditando.descripcion = producto.data.descripcion;
    this.productoEditando.ingredientes = producto.data.ingredientes;
    this.productoEditando.precio = producto.data.precio;
    // Redireccionamos a detalle y pasamos el id del producto como parámetro
    this.router.navigate(['/detalle', this.idProductoSelect]);

  }

  public limpiarProducto(){

    this.idProductoSelect = "";
    this.productoEditando.nombre = "";
    this.productoEditando.descripcion = "";
    this.productoEditando.ingredientes = "";
    this.productoEditando.precio = null;

  }



}
