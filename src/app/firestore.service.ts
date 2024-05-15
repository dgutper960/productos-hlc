import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireStorage} from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFireStorage: AngularFireStorage, private angularFirestore: AngularFirestore) { }


  public insertar(coleccion: string, datos: any){
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion: string){
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public actualizar(coleccion: string, idProducto: string, datos: any){
    return this.angularFirestore.collection(coleccion).doc(idProducto).set(datos);
  }

  public borrar(coleccion: string, idProducto: string){
    return this.angularFirestore.collection(coleccion).doc(idProducto).delete();
  }

  // Obtiene los datos de un producto por id
  public getProducto(coleccion: string, idProducto: string){
    return this.angularFirestore.collection(coleccion).doc(idProducto).snapshotChanges();
  }

  // Subir Imagen al FireStorage
  public subirImagen(nombreCarpeta:string, nombreArchivo:string, imagenBase64:string){
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  // Eliminar Imagen
  public eliminarImagen(url:string){
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }

}
