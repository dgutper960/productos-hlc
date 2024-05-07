import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private alertController: AlertController, private router: Router, private activateRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    // Almacennamos el id del producto en una propiedad de la clase
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.idProducto = idRecibido;
    }

    this.cargarProducto();
  }

  // Borrar producto seleccinado al hacer click en el boton borrar
  // Implementamos una funcion de alerta antes de borrar
  // Asociamos esta función al botón borrar
  // Si el usuario acepta, se llama a la funcion que borra producto de la coleccion
  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Esta acción no se puede deshacer, ¿Confirma borrar producto?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Borrado cancelado');
        }
      }, {
        text: 'Borrar',
        handler: () => {
          console.log('Borrado confirmado');
          // Llamada a foncion borrar
          this.clickBorrar();
        }
      }]
    });
    await alert.present();
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

  public clickInsertar() {
    this.firestoreService.insertar("productos", this.productoSeleccionado.data)
      .then(() => {
        console.log("Nuevo producto instertado");
        // Limpiamos el contenido del producto en edición
        this.productoSeleccionado.data = {} as Producto;
      }, (error) => {
        console.log(error);
      });

    // redirigimos a home
    this.router.navigate(['home']);
  }


}
