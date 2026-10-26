import express from "express";
import type { Request, Response } from "express";

//INICIALIZAR LA APLICACION DE EXPRESS
const app = express();
const PORT = 3000;
// MIDDLEWARE OBLIGATORIO PARA JSON
app.use(express.json());

interface Pedido {
  id: number;
  cliente: string;
  platillo: string;
  total: number;
  entregado: boolean;
}

const listaPedidos: Pedido[] = [
  { id: 1, cliente: "Omar Garcia", platillo: "Pollo a la crema", total: 80, entregado: true },
  { id: 2, cliente: "Guadalupe Hinojosa", platillo: "Sushi", total: 100, entregado: true },
  { id: 3, cliente: "Rocio Oman", platillo: "Pollo frito", total: 90, entregado: false },
  { id: 4, cliente: "Steven Granillo", platillo: "Milanesa con papas", total: 70, entregado: true },
  { id: 5, cliente: "Mario Guardado", platillo: "Pizza", total: 130, entregado: false },
  { id: 6, cliente: "Diego Rivera", platillo: "Club Sandwish", total: 110, entregado: true },
  { id: 7, cliente: "Camilo Bustamante", platillo: "Espagetti con albondigas", total: 90, entregado: true },
  { id: 8, cliente: "Ivan Hermandez", platillo: "Plato Huasteco", total: 100, entregado: false },
  { id: 9, cliente: "Daniel Fernandez", platillo: "Lentejas", total: 60, entregado: true },
  { id: 10, cliente: "Sergio De La O", platillo: "Nuggets", total: 70, entregado: false },
];

app.get("/api/pedidos", function (req: Request, res: Response) {
  res.status(200).json({
    ok: true,
    mensaje: "Lista de pedidos de un restaurant",
    total: listaPedidos.length,
    data: listaPedidos,
  });
});

app.get("/api/pedidos/:id", function (req: Request, res: Response) {
  const idBuscando = Number(req.params.id);
  const pedidoEncontrado = listaPedidos.find(
    (p) => p.id === idBuscando
  );
  if (!pedidoEncontrado) {
    return res.status(404).json({
      ok: false,
      mensaje: `El pedido con id ${idBuscando} NO EXISTE!!!`,
    });
  }
  res.status(200).json({
    ok: true,
    data: pedidoEncontrado,
  });
});

app.post("/api/pedidos", function (req: Request, res: Response) {
  const { cliente, platillo, total, entregado } = req.body;
  let nuevoPedido: Pedido = {
    id: listaPedidos.length + 1,
    cliente,
    platillo,
    total,
    entregado,
  };
  listaPedidos.push(nuevoPedido);
  res.status(201).json({
    ok: true,
    mensaje: "Pedido registrado con exito",
    data: nuevoPedido,
  });
});

app.put("/api/pedidos/:id", function (req: Request, res: Response) {
    const idBuscando =Number(req.params.id);
    const { cliente, platillo, total, entregado } = req.body;
    const indicePedido = listaPedidos.findIndex((p) => p.id === idBuscando );
    if (indicePedido === -1) {
        return res.status(404).json({
            ok: false,
            mensaje: `El pedido con id ${idBuscando} NO EXISTE y no se puede actualizar!!!`
        });
    }
    listaPedidos[indicePedido] ={
        id: idBuscando,
        cliente,
        platillo,
        total,
        entregado,
    };
    res.status(200).json({
        ok:true,
        mensaje: "Pedido actializado con exito",
        data: listaPedidos[indicePedido],
    });
});

app.delete("/api/pedidos/:id", function (req: Request, res: Response) {
    const idBuscando =Number(req.params.id);
    const indicePedido = listaPedidos.findIndex((p) => p.id === idBuscando );
    if (indicePedido === -1) {
        return res.status(404).json({
            ok: false,
            mensaje: `El pedido con id ${idBuscando} NO EXISTE y no se puede eliminar!!!`
        });
    }
    listaPedidos.splice (indicePedido, 1);
    res.status(200).json({
        ok:true,
        mensaje: "Pedido eliminado con exito",
    });
});

app.listen(PORT, function () {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});