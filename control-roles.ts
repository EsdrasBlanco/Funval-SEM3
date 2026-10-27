import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

export const verificarRol = (rolMinimo: 'MODERADOR' | 'ADMIN') => { 
  return (req: Request, res: Response, next: NextFunction): void => { 
    const rol = req.headers['x-rol']; 
    
    // Si no hay rol o si se pide ADMIN y el rol es solo MODERADOR (o cualquier otro)
    if (!rol || typeof rol !== 'string') {
      res.status(403).json({ 
        error: 'Acceso denegado. No se proporcionó el header x-rol.' 
      }); 
      return; 
    }

    const rolUpper = rol.toUpperCase();

    if (rolMinimo === 'ADMIN' && rolUpper !== 'ADMIN') { 
      res.status(403).json({ 
        error: 'Acceso denegado. Se requiere el rol de ADMIN.' 
      }); 
      return; 
    } 

    if (rolMinimo === 'MODERADOR' && rolUpper !== 'ADMIN' && rolUpper !== 'MODERADOR') {
      res.status(403).json({ 
        error: 'Acceso denegado. Se requiere rol de MODERADOR o ADMIN.' 
      }); 
      return;
    }

    next(); 
  }; 
};

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let tareas: Task[] = [
  { id: 1, title: "Estudiar TypeScript avanzado", completed: false },
  { id: 2, title: "Implementar middlewares en Express", completed: true },
  { id: 3, title: "Configurar control de roles en Breakout Room", completed: false },
];

let idCounter = 4;

app.get("/api/tareas", (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    mensaje: "Lista de tareas obtenida con éxito",
    total: tareas.length,
    data: tareas,
  });
});

app.post("/api/tareas", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ ok: false, mensaje: "El título es obligatorio" });
    return;
  }

  const nuevaTarea: Task = {
    id: idCounter++,
    title: title.trim(),
    completed: false,
  };

  tareas.push(nuevaTarea);
  res.status(201).json({ ok: true, mensaje: "Tarea creada con éxito", data: nuevaTarea });
});

app.patch("/api/tareas/soft/:id", verificarRol('MODERADOR'), (req: Request, res: Response) => {
  const idBuscando = Number(req.params.id);
  const tarea = tareas.find((t) => t.id === idBuscando);

  if (!tarea) {
    res.status(404).json({ ok: false, mensaje: "La tarea no fue encontrada" });
    return;
  }

  tarea.completed = true;
  res.status(200).json({
    ok: true,
    mensaje: "Borrado lógico (Soft Delete): Tarea marcada como completada correctamente",
    data: tarea,
  });
});

app.delete("/api/tareas/:id", verificarRol('ADMIN'), (req: Request, res: Response) => {
  const idBuscando = Number(req.params.id);
  const existe = tareas.some((t) => t.id === idBuscando);

  if (!existe) {
    res.status(404).json({ ok: false, mensaje: "La tarea que deseas eliminar no existe" });
    return;
  }

  tareas = tareas.filter((t) => t.id !== idBuscando);
  res.status(200).json({
    ok: true,
    mensaje: "Borrado definitivo (Hard Delete) ejecutado con éxito por un ADMIN",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error global capturado:", err.stack);
  res.status(500).json({
    ok: false,
    error: "Error interno del servidor",
    detalle: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de la Sala 2 corriendo en: http://localhost:${PORT}`);
});