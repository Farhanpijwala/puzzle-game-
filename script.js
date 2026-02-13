var images = [
  "img/farhan.jpeg",
  "img/farhan2.jpg",
  "img/farhan3.webp"
];

var totalClicks = 0;

function randomizeImage() {
  let root = document.documentElement;

  // RANDOM IMAGE EVERY TIME
  let randomIndex = Math.floor(Math.random() * images.length);

  root.style.setProperty("--image", "url(" + images[randomIndex] + ")");

  // random position pieces
  var puzzleItems = document.querySelectorAll("#puzz i");
  puzzleItems.forEach(function (item) {
    item.style.left = Math.random() * (window.innerWidth - 120) + "px";
    item.style.top = Math.random() * (window.innerHeight - 120) + "px";
    item.style.visibility = "visible";
  });
}

randomizeImage();

function reloadPuzzle() {
  document.querySelectorAll(".done").forEach(function (el) {
    el.classList.remove("done");
    el.style.visibility = "visible";
  });

  document.querySelectorAll(".dropped").forEach(function (el) {
    el.classList.remove("dropped");
  });

  var puz = document.querySelector("#puz");
  puz.classList.remove("allDone");
  puz.style = "";
}

// ---------------- CLICK COUNTER ----------------

document.querySelectorAll("#puzz i").forEach(function (element) {
  element.addEventListener("mousedown", function () {
    totalClicks++;
    document.querySelector("#clicks").innerHTML = totalClicks;
  });
});

// ---------------- CLICK MATCH (DESKTOP STYLE) ----------------

document.querySelectorAll("#puzz i").forEach(function (piece) {
  piece.addEventListener("click", function () {
    var alreadyClicked = document.querySelector(".clicked");

    if (alreadyClicked && alreadyClicked !== piece) {
      alreadyClicked.classList.remove("clicked");
    }

    piece.classList.toggle("clicked");
  });
});

document.querySelectorAll("#puz i").forEach(function (slot) {
  slot.addEventListener("click", function () {
    var clickedPiece = document.querySelector(".clicked");
    if (!clickedPiece) return;

    var pieceClass = clickedPiece.classList[0];

    if (slot.classList.contains(pieceClass)) {
      slot.classList.add("dropped");
      clickedPiece.classList.add("done");
      clickedPiece.classList.remove("clicked");
      clickedPiece.style.visibility = "hidden";

      checkIfAllDone();
    }
  });
});

// ---------------- DRAG & DROP ----------------

// drag start
document.querySelectorAll("#puzz i").forEach(function (piece) {
  piece.setAttribute("draggable", "true");

  piece.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", piece.classList[0]);
  });
});

// drop zones
document.querySelectorAll("#puz i").forEach(function (slot) {
  slot.addEventListener("dragover", function (e) {
    e.preventDefault(); // REQUIRED
  });

  slot.addEventListener("drop", function (e) {
    e.preventDefault();

    var draggedClass = e.dataTransfer.getData("text/plain");

    if (slot.classList.contains(draggedClass)) {
      slot.classList.add("dropped");

      var draggedPiece = document.querySelector("#puzz ." + draggedClass);

      draggedPiece.classList.add("done");
      draggedPiece.style.visibility = "hidden";

      checkIfAllDone();
    }
  });
});

// ---------------- COMPLETION ----------------

function checkIfAllDone() {
  if (document.querySelectorAll(".dropped").length === 9) {
    var puz = document.querySelector("#puz");

    puz.classList.add("allDone");
    puz.style.border = "none";
    puz.style.animation = "allDone 1s linear forwards";

    setTimeout(function () {
      reloadPuzzle();
      randomizeImage();
    }, 1500);
  }
}