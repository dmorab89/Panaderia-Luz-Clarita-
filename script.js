

const whatsapp_num = "+50671142542"

const nombresCategoria = {
    panaderia: "Panadería",
    reposteria: "Repostería",
    bocadillos: "Bocadillos"

};

const productos = [
    { id: 1, nombre: "Baguette artesanal", categoria: "panaderia", precio: 1200, emoji: "🥖" },
    { id: 2, nombre: "Pan de masa madre", categoria: "panaderia", precio: 2500, emoji: "🍞" },
    { id: 3, nombre: "Pan integral", categoria: "panaderia", precio: 2000, emoji: "🌾" },
    { id: 4, nombre: "Croissant de mantequilla", categoria: "panaderia", precio: 1500, emoji: "🥐" },
    { id: 5, nombre: "Torta de chocolate", categoria: "reposteria", precio: 12000, emoji: "🍰" },
    { id: 6, nombre: "Cupcakes (6 unidades)", categoria: "reposteria", precio: 5500, emoji: "🧁" },
    { id: 7, nombre: "Galletas de avena (bolsa)", categoria: "reposteria", precio: 2800, emoji: "🍪" },
    { id: 8, nombre: "Tres leches (porción)", categoria: "reposteria", precio: 2200, emoji: "🍮" },
    { id: 9, nombre: "Sándwich de jamón y queso", categoria: "bocadillos", precio: 2800, emoji: "🥪" },
    { id: 10, nombre: "Empanada de carne", categoria: "bocadillos", precio: 1300, emoji: "🥟" },
    { id: 11, nombre: "Mini pizzas (6 unidades)", categoria: "bocadillos", precio: 4500, emoji: "🍕" },
    { id: 12, nombre: "Bandeja de bocadillos surtidos", categoria: "bocadillos", precio: 15000, emoji: "🥗" }
];

//Utilidades

const $ = (id) => document.getElementById(id);  
const fmt = (n) => "₡" + n.toLocaleString("es-CR");

// Carrito
let carrito = {};
try{carrito = JSON.parse(localStorage.getItem("carrito")) || {};}catch(e){carrito = {};}

//Productos y filtros 

function pintarProductos(cat = "todos"){
    const lista = cat === "todos" ? productos : productos.filter((p) => p.categoria === cat);

    $("listaProductos").innerHTML =  lista.map((p) => `
        <article class="rounded-xl border border-cafe/15 bg-white p-4 flex flex-col">
            <div class="text-6xl text-center py-4" aria-hidden="true">${p.emoji}</div>
            <p class="text-xs text-cafe/70 font-medium">${nombresCategoria[p.categoria]}</p>
            <h3 class="font-bold leading-snug flex-1">${p.nombre}</h3>
            <p class="mt-2 font-semibold">${fmt(p.precio)}</p>
            <button data-add="${p.id}" class="mt-3 bg-cafe text-white text-sm font-semibold py-2 rounded-full hover:bg-naranja hover:text-cafe">Agregar</button>
    </article>`).join("");

    // Marca como activo solo el boton de la categoria elegida
    document.querySelectorAll(".filtro").forEach((b)=>
    b.classList.toggle("activo",b.dataset.cat === cat));}

pintarProductos();

