import express from "express";
import type { Request, Response, NextFunction } from 'express'; 

const app = express();
const PORT = 3000;

app.use(express.json());

export interface Producto { 
  id: number;
  nombre: string; 
  precio: number; 
  stock: number; 
  activo: boolean; 
} 

export const validarProducto = (req: Request, res: Response, next: NextFunction): void => { 
  const { nombre, precio } = req.body; 

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') { 
    res.status(400).json({ error: 'El nombre es obligatorio y debe ser texto.' }); 
    return; 
  } 

  if (typeof precio !== 'number' || precio <= 0) {
    res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' }); 
    return; 
  } 

  next(); 
};

let productos: Producto[] = [
  { id: 1, nombre: "Laptop Gamer", precio: 1200, stock: 5, activo: true },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 25, stock: 20, activo: true }
];

let idCounter = 3;

app.post('/api/productos', validarProducto, (req: Request, res: Response) => {
  const { nombre, precio, stock, activo } = req.body;
  
  const nuevoProducto: Producto = {
    id: idCounter++,
    nombre: nombre.trim(),
    precio,
    stock: stock ?? 0,
    activo: activo ?? true
  };

  productos.push(nuevoProducto);
  res.status(201).json({ 
    mensaje: 'Producto creado con éxito', 
    data: nuevoProducto 
  });
});

app.put('/api/productos/:id', validarProducto, (req: Request, res: Response) => {
  const idBuscando = Number(req.params.id);
  const indiceEncontrado = productos.findIndex(p => p.id === idBuscando);

  if (indiceEncontrado === -1) {
    res.status(404).json({ error: 'El producto que deseas actualizar no existe.' });
    return;
  }

  const { nombre, precio, stock, activo } = req.body;

  productos[indiceEncontrado] = {
    id: idBuscando,
    nombre,
    precio,
    stock,
    activo,
  };

  res.status(200).json({
    mensaje: 'Producto actualizado con éxito',
    data: productos[indiceEncontrado]
  });
});

app.get('/api/productos', (req: Request, res: Response) => {
  res.status(200).json({
    total: productos.length,
    data: productos
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de la Sala 1 corriendo en: http://localhost:${PORT}`);
});