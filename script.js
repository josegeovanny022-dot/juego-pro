const menu =
    document.getElementById("menu");

const juego =
    document.getElementById("juego");

const arena =
    document.getElementById("arena");


const puntos1Texto =
    document.getElementById("puntos1");

const puntos2Texto =
    document.getElementById("puntos2");


const vida1Texto =
    document.getElementById("vida1");

const vida2Texto =
    document.getElementById("vida2");


const tiempoTexto =
    document.getElementById("tiempo");


const mensaje =
    document.getElementById("mensaje");

const reiniciar =
    document.getElementById("reiniciar");


let jugador1;
let jugador2;


let puntos1 = 0;
let puntos2 = 0;


let vida1 = 3;
let vida2 = 3;


let tiempo = 120;


let teclas = {};


let objetos = [];

let intervaloObjetos;

let intervaloTiempo;

let dificultad = 1;


let jugando = false;


/* =========================
   INICIAR
========================= */

document
    .getElementById("iniciar")
    .addEventListener(
        "click",
        iniciarJuego
    );


reiniciar.addEventListener(
    "click",
    () => {

        location.reload();

    }
);


function iniciarJuego() {

    menu.style.display =
        "none";

    juego.style.display =
        "block";


    crearJugadores();


    jugando = true;


    intervaloObjetos =
        setInterval(
            crearObjeto,
            900
        );


    intervaloTiempo =
        setInterval(() => {

            tiempo--;

            tiempoTexto.textContent =
                tiempo;


            if (tiempo <= 0) {

                terminarJuego();

            }


            /* Cada 25 segundos
               aumenta el caos */

            if (tiempo % 25 === 0) {

                dificultad++;

            }

        }, 1000);


    juegoPrincipal();
}


/* =========================
   CREAR JUGADORES
========================= */

function crearJugadores() {

    jugador1 = {

        x: 100,

        y: 200,

        velocidad: 5,

        elemento:
            document.createElement("div")
    };


    jugador1.elemento.className =
        "player";

    jugador1.elemento.id =
        "player1";


    arena.appendChild(
        jugador1.elemento
    );


    jugador2 = {

        x: arena.clientWidth - 140,

        y: 200,

        velocidad: 5,

        elemento:
            document.createElement("div")
    };


    jugador2.elemento.className =
        "player";

    jugador2.elemento.id =
        "player2";


    arena.appendChild(
        jugador2.elemento
    );
}


/* =========================
   TECLADO
========================= */

document.addEventListener(
    "keydown",
    (e) => {

        teclas[
            e.key.toLowerCase()
        ] = true;

    }
);


document.addEventListener(
    "keyup",
    (e) => {

        teclas[
            e.key.toLowerCase()
        ] = false;

    }
);


/* =========================
   MOVIMIENTO
========================= */

function moverJugadores() {

    if (!jugando)
        return;


    const ancho =
        arena.clientWidth;

    const alto =
        arena.clientHeight;


    /* JUGADOR 1 */

    if (teclas["w"])
        jugador1.y -=
            jugador1.velocidad;

    if (teclas["s"])
        jugador1.y +=
            jugador1.velocidad;

    if (teclas["a"])
        jugador1.x -=
            jugador1.velocidad;

    if (teclas["d"])
        jugador1.x +=
            jugador1.velocidad;


    /* JUGADOR 2 */

    if (teclas["arrowup"])
        jugador2.y -=
            jugador2.velocidad;

    if (teclas["arrowdown"])
        jugador2.y +=
            jugador2.velocidad;

    if (teclas["arrowleft"])
        jugador2.x -=
            jugador2.velocidad;

    if (teclas["arrowright"])
        jugador2.x +=
            jugador2.velocidad;


    /* LIMITAR JUGADOR 1 */

    jugador1.x = Math.max(
        0,
        Math.min(
            ancho - 35,
            jugador1.x
        )
    );


    jugador1.y = Math.max(
        0,
        Math.min(
            alto - 35,
            jugador1.y
        )
    );


    /* LIMITAR JUGADOR 2 */

    jugador2.x = Math.max(
        0,
        Math.min(
            ancho - 35,
            jugador2.x
        )
    );


    jugador2.y = Math.max(
        0,
        Math.min(
            alto - 35,
            jugador2.y
        )
    );


    actualizarPosiciones();
}


function actualizarPosiciones() {

    jugador1.elemento.style.left =
        jugador1.x + "px";

    jugador1.elemento.style.top =
        jugador1.y + "px";


    jugador2.elemento.style.left =
        jugador2.x + "px";

    jugador2.elemento.style.top =
        jugador2.y + "px";
}


/* =========================
   CREAR OBJETOS
========================= */

function crearObjeto() {

    if (!jugando)
        return;


    const objeto =
        document.createElement("div");


    const numero =
        Math.random();


    if (numero < 0.50) {

        objeto.className =
            "coin";

        objeto.tipo =
            "moneda";

    } else if (numero < 0.75) {

        objeto.className =
            "bomb";

        objeto.tipo =
            "bomba";

    } else {

        objeto.className =
            "power";

        objeto.tipo =
            "poder";
    }


    objeto.x =
        Math.random() *
        (arena.clientWidth - 30);


    objeto.y =
        Math.random() *
        (arena.clientHeight - 30);


    objeto.style.left =
        objeto.x + "px";

    objeto.style.top =
        objeto.y + "px";


    arena.appendChild(objeto);


    objetos.push(objeto);


    /* Los objetos desaparecen
       después de 5 segundos */

    setTimeout(() => {

        if (objeto.parentElement) {

            objeto.remove();

        }


        objetos =
            objetos.filter(
                o => o !== objeto
            );

    }, 5000);
}


/* =========================
   COLISIONES
========================= */

function detectarColisiones() {

    objetos.forEach(
        (objeto) => {

            const rect =
                objeto.getBoundingClientRect();


            const r1 =
                jugador1.elemento
                    .getBoundingClientRect();


            const r2 =
                jugador2.elemento
                    .getBoundingClientRect();


            if (colision(rect, r1)) {

                procesarObjeto(
                    objeto,
                    1
                );

            }


            if (colision(rect, r2)) {

                procesarObjeto(
                    objeto,
                    2
                );

            }

        }
    );

}


function colision(a, b) {

    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );

}


/* =========================
   CHOQUE ENTRE JUGADORES
========================= */

function detectarChoqueJugadores() {

    const r1 =
        jugador1.elemento
            .getBoundingClientRect();


    const r2 =
        jugador2.elemento
            .getBoundingClientRect();


    if (colision(r1, r2)) {

        /* Ambos pierden una vida */

        vida1--;

        vida2--;


        actualizarVida();


        /*
        Los separamos después
        del choque para evitar
        que pierdan muchas vidas
        instantáneamente.
        */

        jugador1.x -= 20;

        jugador2.x += 20;


        /* Evitar salir de la arena */

        if (jugador1.x < 0)
            jugador1.x = 0;


        if (
            jugador2.x >
            arena.clientWidth - 35
        ) {

            jugador2.x =
                arena.clientWidth - 35;

        }


        actualizarPosiciones();


        /*
        Si alguno llega a
        cero vidas termina
        el juego.
        */

        if (
            vida1 <= 0 ||
            vida2 <= 0
        ) {

            terminarJuego();

        }

    }

}


/* =========================
   PROCESAR OBJETOS
========================= */

function procesarObjeto(
    objeto,
    jugador
) {

    if (!objeto.parentElement)
        return;


    if (objeto.tipo === "moneda") {

        if (jugador === 1) {

            puntos1 += 10;

        } else {

            puntos2 += 10;

        }

    }


    if (objeto.tipo === "bomba") {

        if (jugador === 1) {

            vida1--;

            actualizarVida();


            if (vida1 <= 0) {

                terminarJuego();

            }

        } else {

            vida2--;

            actualizarVida();


            if (vida2 <= 0) {

                terminarJuego();

            }

        }

    }


    if (objeto.tipo === "poder") {

        if (jugador === 1) {

            jugador1.velocidad = 9;


            setTimeout(() => {

                jugador1.velocidad = 5;

            }, 4000);

        } else {

            jugador2.velocidad = 9;


            setTimeout(() => {

                jugador2.velocidad = 5;

            }, 4000);

        }

    }


    objeto.remove();


    objetos =
        objetos.filter(
            o => o !== objeto
        );


    actualizarPuntos();
}


/* =========================
   ACTUALIZAR MARCADOR
========================= */

function actualizarPuntos() {

    puntos1Texto.textContent =
        puntos1;

    puntos2Texto.textContent =
        puntos2;

}


function actualizarVida() {

    vida1Texto.textContent =
        "❤️".repeat(
            Math.max(0, vida1)
        );


    vida2Texto.textContent =
        "❤️".repeat(
            Math.max(0, vida2)
        );

}


/* =========================
   FINAL
========================= */

function terminarJuego() {

    if (!jugando)
        return;


    jugando = false;


    clearInterval(
        intervaloObjetos
    );

    clearInterval(
        intervaloTiempo
    );


    if (puntos1 > puntos2) {

        mensaje.innerHTML = `
            🏆 ¡GANÓ EL JUGADOR 1! 🔵
            <br><br>
            ${puntos1} - ${puntos2}
        `;

    } else if (puntos2 > puntos1) {

        mensaje.innerHTML = `
            🏆 ¡GANÓ EL JUGADOR 2! 🔴
            <br><br>
            ${puntos2} - ${puntos1}
        `;

    } else {

        mensaje.innerHTML = `
            🤝 ¡EMPATE!
            <br><br>
            ${puntos1} - ${puntos2}
        `;

    }


    mensaje.style.display =
        "block";

    reiniciar.style.display =
        "block";
}


/* =========================
   BUCLE PRINCIPAL
========================= */

function juegoPrincipal() {

    if (!jugando)
        return;


    moverJugadores();


    detectarColisiones();


    detectarChoqueJugadores();


    requestAnimationFrame(
        juegoPrincipal
    );

}