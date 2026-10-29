// ============================================================
// code.js – Dibujante de muros interactivo para TusPlanos3D
// Se ejecuta tras window.addEventListener("load", ...)
// ============================================================
(function () {
  "use strict";

  const canvas = document.getElementById("canvasPlanos");
  const ctx = canvas.getContext("2d");
  const inputCota = document.getElementById("input-cota");

  const CONFIG = {
    escala: 50,                // 50px = 1 metro
    grosorMuro: 8,
    colorMuro: "#e0e0e0",
    colorPrevisualizacion: "#4fc3f7",
    anchoPuerta: 0.80,
    anchoVentana: 1.20
  };

  // Interfaz de herramientas en el DOM
  const btnMuro = document.getElementById("btn-muro");
  const btnPuerta = document.getElementById("btn-puerta");
  const btnVentana = document.getElementById("btn-ventana");
  if (btnMuro && btnPuerta && btnVentana) {
    (window as unknown as { cambiarHerramienta: (h: string) => void }).cambiarHerramienta('muro');
  }

  // === ESTADO GENERAL ===
  let murosGuardados = [];
  let aberturasGuardadas = []; // {tipo, x, y, angulo, ancho}
  let herramientaActiva = "muro"; // 'muro' | 'puerta' | 'ventana'

  let estadoDibujo = {
    dibujando: false,
    xStart: 0, yStart: 0,
    xCurrent: 0, yCurrent: 0
  };
  let shiftPresionado = false;

  // === MANEJO DE TECLADO (DESHACER Y ATAJOS) ===
  window.addEventListener("keydown", (e) => {
    if (e.key === "Shift") { shiftPresionado = true; render(); }

    // Sistema Deshacer: Ctrl + Z o tecla 'u'
    if ((e.ctrlKey && e.key.toLowerCase() === "z") || e.key.toLowerCase() === "u") {
      if (document.activeElement !== inputCota) {
        e.preventDefault();
        if (estadoDibujo.dibujando) {
          cancelarDibujo();
        } else if (murosGuardados.length > 0) {
          murosGuardados.pop();
        }
        render();
      }
    }

    if (e.key === "Escape") cancelarDibujo();

    // Captura exacta de cota cuando se dibuja muro
    if (herramientaActiva !== "muro" || !estadoDibujo.dibujando) return;
    if ((e.key >= "0" && e.key <= "9") || e.key === "." || e.key === ",") {
      if (document.activeElement !== inputCota) {
        inputCota.style.display = "block";
        inputCota.style.left = `${estadoDibujo.xCurrent}px`;
        inputCota.style.top = `${estadoDibujo.yCurrent}px`;
        inputCota.focus();
        if (e.key === ",") { e.preventDefault(); inputCota.value = "."; }
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") { shiftPresionado = false; render(); }
  });

  // === EVENTOS DE MOUSE ===
  canvas.addEventListener("mousedown", (e) => {
    if (document.activeElement === inputCota) return;

    if (herramientaActiva === "muro") {
      if (!estadoDibujo.dibujando) {
        estadoDibujo.dibujando = true;
        estadoDibujo.xStart = e.clientX; estadoDibujo.yStart = e.clientY;
        estadoDibujo.xCurrent = e.clientX; estadoDibujo.yCurrent = e.clientY;
      } else {
        guardarMuroActual();
      }
    } else {
      intentarInsertarAbertura(e.clientX, e.clientY);
    }
    render();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (herramientaActiva === "muro" && estadoDibujo.dibujando && document.activeElement !== inputCota) {
      if (shiftPresionado) {
        const dx = e.clientX - estadoDibujo.xStart;
        const dy = e.clientY - estadoDibujo.yStart;
        if (Math.abs(dx) > Math.abs(dy)) {
          estadoDibujo.xCurrent = e.clientX; estadoDibujo.yCurrent = estadoDibujo.yStart;
        } else {
          estadoDibujo.xCurrent = estadoDibujo.xStart; estadoDibujo.yCurrent = e.clientY;
        }
      } else {
        estadoDibujo.xCurrent = e.clientX;
        estadoDibujo.yCurrent = e.clientY;
      }
      render();
    } else if (herramientaActiva !== "muro") {
      estadoDibujo.xCurrent = e.clientX;
      estadoDibujo.yCurrent = e.clientY;
      render();
    }
  });

  // === COTA EXACTA POR TECLADO ===
  window.addEventListener("keydown", (e) => {
    if (herramientaActiva !== "muro" || !estadoDibujo.dibujando) return;
    if ((e.key >= "0" && e.key <= "9") || e.key === "." || e.key === ",") {
      if (document.activeElement !== inputCota) {
        inputCota.style.display = "block";
        inputCota.style.left = `${estadoDibujo.xCurrent}px`;
        inputCota.style.top = `${estadoDibujo.yCurrent}px`;
        inputCota.focus();
        if (e.key === ",") { e.preventDefault(); inputCota.value = "."; }
      }
    }
  });

  inputCota.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const metrosExactos = parseFloat((inputCota.value as string).replace(",", "."));
      if (!isNaN(metrosExactos) && metrosExactos > 0) {
        const pixelesExactos = metrosExactos * CONFIG.escala;
        const dx = estadoDibujo.xCurrent - estadoDibujo.xStart;
        const dy = estadoDibujo.yCurrent - estadoDibujo.yStart;
        let angulo = Math.atan2(dy, dx);
        if (shiftPresionado) {
          if (Math.abs(dx) > Math.abs(dy)) angulo = dx > 0 ? 0 : Math.PI;
          else angulo = dy > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
        estadoDibujo.xCurrent = estadoDibujo.xStart + Math.cos(angulo) * pixelesExactos;
        estadoDibujo.yCurrent = estadoDibujo.yStart + Math.sin(angulo) * pixelesExactos;
        guardarMuroActual();
      } else {
        ocultarInputFlotante();
      }
    }
    if (e.key === "Escape") cancelarDibujo();
  });

  // === FUNCIONES LÓGICAS ===
  function guardarMuroActual() {
    const dx = estadoDibujo.xCurrent - estadoDibujo.xStart;
    const dy = estadoDibujo.yCurrent - estadoDibujo.yStart;
    const distanciaPixeles = Math.sqrt(dx * dx + dy * dy);
    const longitudMetros = distanciaPixeles / CONFIG.escala;

    if (longitudMetros > 0.05) {
      murosGuardados.push({
        x1: estadoDibujo.xStart, y1: estadoDibujo.yStart,
        x2: estadoDibujo.xCurrent, y2: estadoDibujo.yCurrent,
        longitud: longitudMetros
      });
      estadoDibujo.xStart = estadoDibujo.xCurrent;
      estadoDibujo.yStart = estadoDibujo.yCurrent;
    }
    ocultarInputFlotante();
    render();
  }

  function cancelarDibujo() {
    estadoDibujo.dibujando = false;
    ocultarInputFlotante();
    render();
  }

  function ocultarInputFlotante() {
    inputCota.value = "";
    inputCota.style.display = "none";
    inputCota.blur();
  }

  // === INTERSECCIÓN Y LÓGICA DE CARPINTERÍA ===
  function intentarInsertarAbertura(mx, my) {
    let mejorMatch = null;
    let distMinima = 20; // Tolerancia píxeles al clic cerca de muro

    murosGuardados.forEach((muro) => {
      const A = mx - muro.x1; const B = my - muro.y1;
      const C = muro.x2 - muro.x1; const D = muro.y2 - muro.y1;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = (A * C + B * D) / lenSq;

      let xx, yy;
      if (param < 0) { xx = muro.x1; yy = muro.y1; }
      else if (param > 1) { xx = muro.x2; yy = muro.y2; }
      else { xx = muro.x1 + param * C; yy = muro.y1 + param * D; }

      const dx = mx - xx; const dy = my - yy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < distMinima) {
        distMinima = dist;
        mejorMatch = { x: xx, y: yy, angulo: Math.atan2(D, C) };
      }
    });

    if (mejorMatch) {
      const anchoElemento = herramientaActiva === "puerta" ? CONFIG.anchoPuerta : CONFIG.anchoVentana;
      aberturasGuardadas.push({
        tipo: herramientaActiva,
        x: mejorMatch.x,
        y: mejorMatch.y,
        angulo: mejorMatch.angulo,
        ancho: anchoElemento
      });
    }
  }

  // === RENDERIZADO GRÁFICO ===
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rejilla de Fondo
    ctx.strokeStyle = "#252525"; ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += CONFIG.escala) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += CONFIG.escala) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Dibujar muros consolidados
    murosGuardados.forEach(muro => {
      dibujarSegmentoMuro(muro.x1, muro.y1, muro.x2, muro.y2, CONFIG.colorMuro);
      dibujarEtiquetaMedida(muro.x1, muro.y1, muro.x2, muro.y2, muro.longitud);
    });

    // Dibujar aberturas sobre los muros
    aberturasGuardadas.forEach(ab =>
      dibujarCarpinteria(ab.tipo, ab.x, ab.y, ab.angulo, ab.ancho)
    );

    // Previsualización dependiendo de la herramienta
    if (herramientaActiva === "muro" && estadoDibujo.dibujando) {
      const dx = estadoDibujo.xCurrent - estadoDibujo.xStart;
      const dy = estadoDibujo.yCurrent - estadoDibujo.yStart;
      const longitudActual = Math.sqrt(dx * dx + dy * dy) / CONFIG.escala;
      dibujarSegmentoMuro(estadoDibujo.xStart, estadoDibujo.yStart, estadoDibujo.xCurrent, estadoDibujo.yCurrent, CONFIG.colorPrevisualizacion);
      dibujarEtiquetaMedida(estadoDibujo.xStart, estadoDibujo.yStart, estadoDibujo.xCurrent, estadoDibujo.yCurrent, longitudActual);
    } else if (herramientaActiva !== "muro") {
      // Fantasma dinámico bajo el cursor
      dibujarCarpinteria(herramientaActiva, estadoDibujo.xCurrent, estadoDibujo.yCurrent, 0,
        herramientaActiva === "puerta" ? CONFIG.anchoPuerta : CONFIG.anchoVentana, true);
    }
  }

  function dibujarSegmentoMuro(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = CONFIG.grosorMuro;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function dibujarEtiquetaMedida(x1, y1, x2, y2, longitud) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#ffca28";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0, 0, 0, 1)";
    ctx.fillText(`${longitud.toFixed(2)} m`, mx, my - 8);
    ctx.restore();
  }

  function dibujarCarpinteria(tipo, x, y, angulo, ancho, esGhost = false) {
    const anchoPx = ancho * CONFIG.escala;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angulo);
    ctx.globalAlpha = esGhost ? 0.4 : 1.0;
    if (tipo === "puerta") {
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(-anchoPx / 2, -CONFIG.grosorMuro, anchoPx, CONFIG.grosorMuro * 2);
      ctx.strokeStyle = "#ff7043"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-anchoPx / 2, 0); ctx.lineTo(-anchoPx / 2, -anchoPx); ctx.stroke();
      ctx.strokeStyle = "#ff7043"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(-anchoPx / 2, 0, anchoPx, -Math.PI / 2, 0); ctx.stroke();
      ctx.setLineDash([]);
    } else if (tipo === "ventana") {
      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(-anchoPx / 2, -CONFIG.grosorMuro, anchoPx, CONFIG.grosorMuro * 2);
      ctx.strokeStyle = "#26a69a"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-anchoPx / 2, 0); ctx.lineTo(anchoPx / 2, 0); ctx.stroke();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-anchoPx / 2, -2); ctx.lineTo(anchoPx / 2, -2);
      ctx.moveTo(-anchoPx / 2, 2); ctx.lineTo(anchoPx / 2, 2); ctx.stroke();
    }
    // Etiqueta de tipo
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Solo dibujar etiqueta si no es ghost (o dibujarla en diferente estilo)
    if (!esGhost) {
      ctx.fillText(tipo.charAt(0).toUpperCase(), 0, 0);
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  // === EXPORTACIÓN TÉCNICA A PDF ===
  function exportarAPDF() {
    if (murosGuardados.length === 0) {
      alert("Dibuja infraestructura antes de exportar.");
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("jsPDF no cargado; usa el botón 'Descargar PDF' del panel (window.print).");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "l", unit: "mm", format: "a4" });
    const anchoA4 = 297; const altoA4 = 210;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    murosGuardados.forEach(m => {
      minX = Math.min(minX, m.x1, m.x2);
      maxX = Math.max(maxX, m.x1, m.x2);
      minY = Math.min(minY, m.y1, m.y2);
      maxY = Math.max(maxY, m.y1, m.y2);
    });
    const centroX = (minX + maxX) / 2;
    const centroY = (minY + maxY) / 2;

    const factorEscalaMm = 20 / CONFIG.escala;

    // Marco estándar
    doc.setDrawColor(60); doc.setLineWidth(0.4);
    doc.rect(10, 10, anchoA4 - 20, altoA4 - 20);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text("PLANO DE VIVIENDA - ARQUITECTURA", 15, 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(`Escala: 1m = ${factorEscalaMm.toFixed(1)}mm | Muros: ${murosGuardados.length} | Carpinterías: ${aberturasGuardadas.length}`, 15, 25);

    // Dibujar muros en el PDF
    murosGuardados.forEach(muro => {
      const x1 = (anchoA4 / 2) + (muro.x1 - centroX) * factorEscalaMm;
      const y1 = (altoA4 / 2) + (muro.y1 - centroY) * factorEscalaMm;
      const x2 = (anchoA4 / 2) + (muro.x2 - centroX) * factorEscalaMm;
      const y2 = (altoA4 / 2) + (muro.y2 - centroY) * factorEscalaMm;
      doc.setDrawColor(0); doc.setLineWidth(1.2);
      doc.line(x1, y1, x2, y2);
      doc.setFontSize(8);
      doc.text(`${muro.longitud.toFixed(2)} m`, (x1 + x2) / 2, ((y1 + y2) / 2) - 1, { align: "center" });
    });

    // Dibujar carpinterías en el PDF
    aberturasGuardadas.forEach(ab => {
      const pdfX = (anchoA4 / 2) + (ab.x - centroX) * factorEscalaMm;
      const pdfY = (altoA4 / 2) + (ab.y - centroY) * factorEscalaMm;
      doc.setFillColor(255); doc.circle(pdfX, pdfY, 2, "F");
      doc.setFontSize(7); doc.text(ab.tipo === "puerta" ? "P" : "V", pdfX, pdfY + 0.8, { align: "center" });
    });

    doc.autoPrint({ variant: "prompt" });
    doc.save("plano-distribucion.pdf");
  }

  // === FUNCIONES DE HERRAMIENTAS ===
  window.cambiarHerramienta = function (herramienta) {
    herramientaActiva = herramienta;
    if (btnMuro && btnPuerta && btnVentana) {
      btnMuro.classList.remove("active");
      btnPuerta.classList.remove("active");
      btnVentana.classList.remove("active");
      const btn = document.getElementById(`btn-${herramienta}`);
      if (btn) btn.classList.add("active");
    }
    if (!estadoDibujo.dibujando) {
      inputCota.style.display = "none";
    }
    render();
  };

  window.exportarAPDF = exportarAPDF;

  // === 10. ARRANQUE ===
  window.addEventListener("load", () => {
    // Cargar jsPDF si no está (placeholder CDN). Forzar dimensions correctas
    resizeCanvas();
    render();
  });
})();