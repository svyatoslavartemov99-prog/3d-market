if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

const defaultProducts = [
  { id: 1, title: "Шарнирный Кристальный Дракон (Шелк)", price: 590, oldPrice: 950, cat: "Драконы", rating: "4.9", emoji: "🐉", img: "", desc: "Подвижный 3D-дракон длиной 28 см. Каждое звено гибко двигается в руках. Напечатан из переливающегося шелкового PLA-пластика на принтере Bambu Lab." },
  { id: 2, title: "Кликер-брелок Механическая Клавиша", price: 250, oldPrice: 400, cat: "Антистресс", rating: "5.0", emoji: "🕹", img: "", desc: "Приятный антистресс-кликер с настоящим механическим переключателем внутри. Издает сочный щелчок при нажатии, удобно носить на ключах или рюкзаке." },
  { id: 3, title: "Подвижный Аксолотль Милашка", price: 420, oldPrice: 650, cat: "Антистресс", rating: "4.8", emoji: "🦎", img: "", desc: "Милый шарнирный аксолотль длиной 16 см. Приятно перекатывается в ладонях, безопасный экологичный пластик без запаха." },
  { id: 4, title: "Брелок-котик с подвижным хвостиком", price: 190, oldPrice: 320, cat: "Брелоки", rating: "4.9", emoji: "🐱", img: "", desc: "Стильный брелок на рюкзак или ключи с прочным металлическим кольцом и подвижным хвостиком." }
];

const availableColors = ["🌈 Радужный шелк", "🌌 Фиолетово-синий", "🖤 Черный матовый", "🤍 Белый глянец", "💚 Неоновый лайм"];

let products = JSON.parse(localStorage.getItem('polyhub_products_v2')) || defaultProducts;
let cart = [];
let currentCat = 'Все';
let isAdmin = false;
let uploadedImageBase64 = "";
let selectedColor = availableColors[0];
const ADMIN_PIN = "1234";

function saveProducts() {
  try {
    localStorage.setItem('polyhub_products_v2', JSON.stringify(products));
  } catch (e) {
    alert("Память переполнена большими фото. Удалите старые товары.");
  }
}

function getEmojiByCat(cat) {
  if (cat === "Драконы") return "🐉";
  if (cat === "Антистресс") return "🕹";
  if (cat === "Брелоки") return "🔑";
  return "🧊";
}
