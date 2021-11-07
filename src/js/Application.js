import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();
    this._loading = document.querySelector("progress");
    this.planets = [];

    this._startLoading();
    this.emit(Application.events.READY);
  }

  async _load() {
    const URL = `https://swapi.boom.dev/api/planets/`;

    let res = await fetch(URL);
    let planetsData = await res.json();
    let next = planetsData.next;
    this.planets = [...this.planets, ...planetsData.results];
    while (next) {
      res = await fetch(next);
      planetsData = await res.json();
      next = planetsData.next;
      this.planets = [...this.planets, ...planetsData.results];
    }

    this.planets.forEach((planet) => {
      this._create(planet.name, planet.terrain, planet.population);
    });
    this._stopLoading();
  }

  _create(name, terrain, population) {
    const planet = document.createElement("div");
    planet.classList.add("box");
    planet.innerHTML = this._render({
      name: name,
      terrain: terrain,
      population: population,
    });

    document.body.querySelector(".main").appendChild(planet);
  }

  async _startLoading() {
    await this._load();
  }

  _stopLoading() {
    this._loading.style.display = "none";
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}