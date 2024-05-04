import { Component } from '@angular/core';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';

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

  constructor(private firestoreService: FirestoreService) {
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
  }

  public actualizaProducto(){
    this.firestoreService.actualizar("productos", this.idProductoSelect, this.productoEditando)
    .then(()=>{
      this.cargarListaProductos();
      this.productoEditando = {} as Producto;
    });

  }

  public clickBorrar(){
    this.firestoreService.borrar("productos", this.idProductoSelect)
    .then(()=>{
      // Actualizamos la lista
      this.cargarListaProductos();
      // Limpiamos los datos en pantalla
      this.idProductoSelect = null;
      this.productoEditando = {} as Producto;
    });
  }

  public clickCancelar(){
    this.idProductoSelect = null;
    this.productoEditando = {} as Producto;
  }

}
