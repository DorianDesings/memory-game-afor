/* 
Orden de un script
  - Elementos del DOM
  - Constantes de JS
  - Variables de JS
  - Funciones
  - Eventos

  Siguiendo este orden te aseguras de que no intentarás acceder a algo antes de que exista
*/

/* 
const allCards = document.querySelectorAll('.card')
allCards.forEach(card=>card.addEventListener('click', ()=>{}))

  Esta versión funciona perfectamente, pero estás creando 12 eventos.

const gameContainerElement = document.getElementById('game-container')
gameContainerElement.addEventListener('click', ()=>{})

  Esta versión hace exactamente lo mismo, pero sólo tienes un evento y si aumenta el número de tarjetas no aumenta el número de eventos.
*/

const gameContainerElement = document.getElementById('game-container');
const triesElement = document.getElementById('tries');

const animalsImages = ['bird', 'bird', 'cat', 'cat', 'elephant', 'elephant', 'horse', 'horse', 'lion', 'lion', 'squirrel', 'squirrel'];

// Primera imagen que seleccionas
let imageA = null;
// Segunda imagen que seleccionas
let imageB = null;
// Referencia para volver a ocultar las imágenes cuando fallas
let timeoutId = null;
// Variable para controlar si puedes hacr click o no (evita que puedas seleccionar más de 2 imágenes seguidas)
let canPlay = true;
// Número de intentos
let tries = 0;

const shuffleAnimals = () => {
  // Este es el algoritmo de Fisher Yates que es el que mezcla aleatoriamente de la forma más correcta, para un ejercicio de este tipo puedes usar sort y el resultado no va a cambiar demasiado.

  // El "mejor"
  // for (let i = animalsImages.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [animalsImages[i], animalsImages[j]] = [animalsImages[j], animalsImages[i]];
  // }

  // El "simple"
  animalsImages.sort(() => Math.random() - 0.5);
};

const printTries = () => {
  triesElement.textContent = `Intentos ${tries}`;
};

const hideImages = () => {
  //con esto recorres todos los hijos y les quitas el background a todos los que no estén marcados como correctos.
  [...gameContainerElement.children].forEach(child => {
    if (!child.dataset.correct) child.style.backgroundImage = '';
  });

  clearTimeout(timeoutId);
  timeoutId = null;
  canPlay = true;
};

const checkImages = (imageName, domImage) => {
  //Si no tenemos imagenA guardamos la primera selección (nombre y elemento del DOM)
  if (!imageA) {
    imageA = { name: imageName, domReference: domImage };
    return;
  }

  //Si no tenemos imagenB guardamos la segunda selección (nombre y elemento del DOM)
  if (!imageB) {
    imageB = { name: imageName, domReference: domImage };
    // Evitamos que se pueda seleccionar una tercera imagen hasta comprobar si coinciden
    canPlay = false;
    // Aumentamos el número de intentos
    tries++;
    printTries();
  }

  // Si el nombre coincide es que las imágenes son iguales y necesitamos ponerle alguna marca para saber que son correctas.
  if (imageA.name === imageB.name) {
    imageA.domReference.dataset.correct = true;
    imageB.domReference.dataset.correct = true;
    canPlay = true;
  }

  // Si el nombre no coincide reseteamos el backgroundImage de todos los elementos que no estén marcados como correctos
  if (imageA.name !== imageB.name) {
    // Lo hago con un timeout para que te de tiempo a ver la imagen y no se resetee automáticamente
    timeoutId = setTimeout(hideImages, 1000);
  }

  imageA = null;
  imageB = null;
};

const showCardImage = (card, index) => {
  // Control para que no puedas hacer click en más de 2 imágenes seguidas
  if (!canPlay) return;

  // animalsImages[index] -> La imagen del array
  // gameContainerElement.children[index] -> El elemento del DOM que corresponde a esa imagen

  card.style.backgroundImage = `url(../assets/images/${animalsImages[index]}.jpg)`;
  checkImages(animalsImages[index], gameContainerElement.children[index]);
};

shuffleAnimals();

gameContainerElement.addEventListener('click', event => {
  // Nunca se mete lógica reutilizable dentro de un evento porque te cargas la reutilización
  // Si el click no ha sido en una tarjeta, corto la ejecución
  if (!event.target.classList.contains('card')) return;
  // Obtener el número de hijo para asociarlo con el indice del array, 0,1,2,3...
  // Necesitamos hacer un spread operator para convertirlo a array porque los children son son un NodeList y no tienen el método indexOf
  const childPosition = [...gameContainerElement.children].indexOf(event.target);
  // Envío a la función la card donde hice click y la posición que le corresponde.
  showCardImage(event.target, childPosition);
});
