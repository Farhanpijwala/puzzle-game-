var images = [
  "img/farhan.jpeg",
  "img/farhan2.jpg",
  "img/farhan3.webp"
];

var totalClicks = 0;

function randomizeImage() {
  let root = document.documentElement;

  let randomIndex = Math.floor(Math.random() * images.length);
  root.style.setProperty("--image", "url(" + images[randomIndex] + ")");

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
  element.addEventListener("pointerdown", function () {
    totalClicks++;
    document.querySelector("#clicks").innerHTML = totalClicks;
  });
});

// ---------------- DRAG SYSTEM (PC + MOBILE) ----------------

let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll("#puzz i").forEach(function (piece) {

  piece.addEventListener("pointerdown", function (e) {
    draggedPiece = piece;

    piece.style.zIndex = 9999;

    offsetX = e.clientX - piece.offsetLeft;
    offsetY = e.clientY - piece.offsetTop;

    piece.setPointerCapture(e.pointerId);
  });

  piece.addEventListener("pointermove", function (e) {
    if (!draggedPiece) return;

    draggedPiece.style.left = (e.clientX - offsetX) + "px";
    draggedPiece.style.top = (e.clientY - offsetY) + "px";
  });

  piece.addEventListener("pointerup", function (e) {
    if (!draggedPiece) return;

    checkDrop(draggedPiece);

    draggedPiece.releasePointerCapture(e.pointerId);
    draggedPiece = null;
  });

});

// ---------------- DROP CHECK ----------------

function checkDrop(piece) {
  let pieceClass = piece.classList[0];

  document.querySelectorAll("#puz i").forEach(function (slot) {

    let slotRect = slot.getBoundingClientRect();
    let pieceRect = piece.getBoundingClientRect();

    // check overlap
    if (
      pieceRect.left < slotRect.right &&
      pieceRect.right > slotRect.left &&
      pieceRect.top < slotRect.bottom &&
      pieceRect.bottom > slotRect.top
    ) {

      if (slot.classList.contains(pieceClass)) {
        slot.classList.add("dropped");

        piece.classList.add("done");
        piece.style.visibility = "hidden";

        checkIfAllDone();
      }

    }

  });
}

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
