async function fetchdog() {
  try {
    const response = await fetch("https://api.thedogapi.com/v1/breeds");
    if (!response.ok) throw new Error("wait to load everything");
    const racas = await response.json();

    const galeria = document.getElementById("dog-cards");
    galeria.innerHTML = "";

    const promises = racas.map(async (raca) => {
      let imgUrl = "";
      if (raca.image?.url) {
        imgUrl = raca.image.url;
      } else {
        try {
          const busca = await fetch(
            `https://api.thedogapi.com/v1/images/search?breed_id=${raca.id}`
          );
          const resultado = await busca.json();
          imgUrl = resultado[0]?.url || "";
        } catch (error) {
          console.error(`wit error occures${raca.name}:`, error);
        }
      }
      return { ...raca, imgUrl };
    });

    const racasComImagens = await Promise.all(promises);

    racasComImagens.forEach((raca) => {
      const card = document.createElement("div");
      card.className = "dog-card";
      card.setAttribute("data-name", raca.name.toLowerCase());

      const imgElement = raca.imgUrl
        ? `<img src="${raca.imgUrl}" alt="${raca.name}" loading="lazy"/>`
        : `<div class="no-image">No Image</div>`;

      card.innerHTML = `
        ${imgElement}
        <h2>${raca.name}</h2>
        <p><strong>Weight:</strong> ${raca.weight.metric} kg</p>
        <p><strong>Height:</strong> ${raca.height.metric} cm</p>
        <p><strong>Temperament:</strong> ${raca.temperament || "Not informed"}</p>
      `;

      galeria.appendChild(card);
    });

    adicionarParallaxNosCards();
  } catch (error) {
    console.error("error:", error);
    alert("error occures: wait till data to load");
  }
}

async function fetchbreed() {
  try {
    const response = await fetch("https://api.thedogapi.com/v1/breeds");
    if (!response.ok) throw new Error("error occures: wait till data to load");
    const racas = await response.json();

    const datalist = document.getElementById("racas");
    datalist.innerHTML = "";

    racas.sort((a, b) => a.name.localeCompare(b.name));

    racas.forEach((raca) => {
      const option = document.createElement("option");
      option.value = raca.name;
      datalist.appendChild(option);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("error occures: wait till data to load");
  }
}

function adicionarParallaxNosCards() {
  const cards = document.querySelectorAll(".dog-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateX = percentY * 10;
      const rotateY = percentX * -10;

      card.style.setProperty("--rotateX", `${rotateX}deg`);
      card.style.setProperty("--rotateY", `${rotateY}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rotateX", `0deg`);
      card.style.setProperty("--rotateY", `0deg`);
    });
  });
}

let slideInterval;

function iniciarSlide() {
  const galeria = document.getElementById("dog-cards");

  slideInterval = setInterval(() => {
    galeria.scrollBy({ left: 1, behavior: "auto" });
    if (galeria.scrollLeft + galeria.clientWidth >= galeria.scrollWidth) {
      galeria.scrollTo({ left: 0, behavior: "auto" });
    }
  }, 30);

}

function buscarERolar() {
  const nome = document.getElementById("breedInput").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".dog-card");

  let encontrado = false;

  cards.forEach((card) => {
    if (card.dataset.name.includes(nome)) {
      encontrado = true;
      clearInterval(slideInterval);
      card.scrollIntoView({ behavior: "smooth", inline: "center" });
      card.style.border = "2px solid black";

      setTimeout(() => {
        card.style.border = "";
        iniciarSlide();
      }, 15000);
    }
  });

  if (!encontrado) {
    alert("Breed not found.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchbreed();
  await fetchdog();
  iniciarSlide();
});

document.getElementById("searchButton").addEventListener("click", (e) => {
  e.preventDefault();
  buscarERolar();
});
