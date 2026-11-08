

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

//dibuja las tarjetas segun la categoria seleccionada, si no hay categoria seleccionada dibuja todos los productos
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
    b.classList.toggle("activo", b.dataset.cat === cat));
}

//Muestra los productos de la categoria seleccionada al hacer click en el boton correspondiente
$("filtros").addEventListener("click", (e) => {
    const b = e.target.closest(".filtro");
    if (b) pintarProductos(b.dataset.cat);
});

//Agrega productos al carrito al hacer click en el boton correspondiente
$("listaProductos").addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    const id = b.dataset.add;
    carrito[id] = (carrito[id] || 0) + 1;
    actualizar();
    b.textContent = "Agregado ✓";
    setTimeout(() => (b.textContent = "Agregar"),900);
});

//CARRITO----------------------------------------------------

//Actualiza el carrito, mostrando la cantidad de productos, el total y los botones para agregar o quitar productos
function actualizar(){
    try{localStorage.setItem("carrito", JSON.stringify(carrito));} catch{}

    const ids = Object.keys(carrito);
    const cantidad = ids.reduce((s,id) => s + carrito[id],0);
    const total = ids.reduce((s,id) => s + carrito[id] * productos.find((p) => p.id == id).precio,0);

    $("contador").textContent = cantidad;
    $("totalCarrito").textContent = fmt(total);
    $("cotizar").disabled = cantidad === 0;


    $("itemsCarrito").innerHTML = ids.length ? ids.map((id) => {
        const p = productos.find((x) => x.id == id);
        return `
        <div class="flex items-center gap-3">
          <span class="text-3xl" aria-hidden="true">${p.emoji}</span>
          <div class="flex-1">
            <p class="font-semibold leading-tight">${p.nombre}</p>
            <p class="text-sm text-cafe/70">${fmt(p.precio)} c/u</p>
          </div>
          <div class="flex items-center gap-2">
            <button data-menos="${id}" aria-label="Quitar uno" class="hover:bg-red-500 hover:text-white w-7 h-7 rounded-full border border-cafe">−</button>
            <span class="w-5 text-center">${carrito[id]}</span>
            <button data-mas="${id}" aria-label="Agregar uno" class="hover:bg-green-500 hover:text-white w-7 h-7 rounded-full border border-cafe">+</button>
          </div>
        </div>`;
      }).join("")
    : `<p class="text-cafe/70">Tu carrito está vacío. Agrega productos para cotizar.</p>`;
}

//Suma o resta 1 al producto correspondiente al hacer click en los botones de + o -  del carrito
$("itemsCarrito").addEventListener("click", (e) => {
    const mas = e.target.closest("[data-mas]");
    const menos = e.target.closest("[data-menos]");
    if(mas) carrito[mas.dataset.mas]++;
    if(menos){
        const id = menos.dataset.menos;
        carrito[id]--;
        if(carrito[id] <= 0) delete carrito[id];
    }
    actualizar();
});


//abrir y cerrar carrito
function abrir(v){
    $("carrito").classList.toggle("translate-x-full",!v);
    $("fondo").classList.toggle("hidden",!v);
}

//Eventos para abrir y cerrar el carrito
$("abrirCarrito").addEventListener("click", () => abrir(true));
$("cerrarCarrito").addEventListener("click", () => abrir(false));
$("fondo").addEventListener("click", () => abrir(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && abrir(false));

// ---------- WhatsApp ----------

//total con mensaje de cotización para enviar por WhatsApp al hacer click en el boton cotizar
$("cotizar").addEventListener("click", () => {
  let total = 0;
  const lineas = Object.keys(carrito).map((id) => {
    const p = productos.find((x) => x.id == id);
    const sub = p.precio * carrito[id];
    total += sub;
    return `• ${carrito[id]} x ${p.nombre} - ${fmt(sub)}`;
  });
  const mensaje = `Hola, quiero cotizar este pedido:\n\n${lineas.join("\n")}\n\nTotal estimado: ${fmt(total)}`;
  window.open(`https://wa.me/${+50671142542}?text=${encodeURIComponent(mensaje)}`, "_blank");
});



pintarProductos();
actualizar();