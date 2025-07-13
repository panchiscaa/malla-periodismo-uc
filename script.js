
let malla = [];
let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

fetch("malla_periodismo_uc.json")
  .then(res => res.json())
  .then(data => {
    malla = data;
    renderMalla();
  });

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";
  const semestres = [...new Set(malla.map(r => r.semestre))];

  semestres.forEach(sem => {
    const col = document.createElement("div");
    col.className = "semestre";
    col.innerHTML = `<h2>Semestre ${sem}</h2>`;

    malla.filter(r => r.semestre === sem).forEach(ramo => {
      const div = document.createElement("div");
      div.className = "ramo";
      div.textContent = ramo.nombre;

      const bloqueado = ramo.prerrequisitos && !ramo.prerrequisitos.every(pr => aprobados.includes(pr));
      if (bloqueado && !aprobados.includes(ramo.nombre)) {
        div.classList.add("bloqueado");
      } else if (aprobados.includes(ramo.nombre)) {
        div.classList.add("aprobado");
      }

      div.onclick = () => {
        if (bloqueado) return;

        if (aprobados.includes(ramo.nombre)) {
          aprobados = aprobados.filter(r => r !== ramo.nombre);
        } else {
          aprobados.push(ramo.nombre);
        }
        localStorage.setItem("aprobados", JSON.stringify(aprobados));
        renderMalla();
      };

      col.appendChild(div);
    });

    container.appendChild(col);
  });
}
