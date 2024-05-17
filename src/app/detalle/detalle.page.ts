import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../producto';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

// share
import { Share } from '@capacitor/share';

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
  imagenSelec: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) { }

    // metodo de compartir
    // Añade control de erorres en caso de elementos vacios
    async compartir() {
      try {
        const ingredientes = this.productoSeleccionado?.data?.ingredientes;
        
        if (!ingredientes) {
          throw new Error('El título del producto no está disponible o está vacío');
        }
    
        await Share.share({
          text: ingredientes,
          dialogTitle: 'Compartir' // Opcional, para proporcionar un título al diálogo de compartir
        });
        console.log("Compartido con éxito");
      } catch (error) {
        console.error("Error al compartir:", error.message);
      }
    }
    


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

  // Seleccionar imagen
  async seleccionarImagen() {
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1
          }).then(
            (results) => {
              if (results.length > 0) {
                this.imagenSelec = "data:image/jpeg;base64," + results[0];
                console.log(`Imagen seleccionada ${this.imagenSelec}`);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // Subir Imagen seleccinada
  async subirImagen() {
    const loading = await this.loadingController.create({
      message: 'Subiendo Imagen. Espere'
    });
    const toast = await this.toastController.create({
      message: 'Imagen subida correctamente',
      duration: 3000
    });

    let nombreCarpeta = "imagenes";

    loading.present();

    let nombreImagen = `${new Date().getTime()}`;
    this.firestoreService.subirImagen(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            console.log(`downloadURL: ${downloadURL}`);
            // Obtenemos la url de la imagen
            this.productoSeleccionado.data.imagenURL = downloadURL;
            toast.present();
            loading.dismiss();
          })
      });

  }

  // Eliminar imagen por URL
  async eliminarImagen(imagenURL: string) {
    const toast = await this.toastController.create({
      message: 'Imagen Borrada Correctamente',
      duration: 3000
    });
    this.firestoreService.eliminarImagen(imagenURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

}
