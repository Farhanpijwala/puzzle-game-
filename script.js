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
    item.classList.remove("done");
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
}

// ---------------- CLICK COUNTER ----------------

document.querySelectorAll("#puzz i").forEach(function (element) {
  element.addEventListener("pointerdown", function () {
    totalClicks++;
    document.querySelector("#clicks").innerHTML = totalClicks;
  });
});

// ---------------- DRAG SYSTEM (PC + MOBILE) ----------------

let currentPiece = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll("#puzz i").forEach(function (piece) {

  piece.addEventListener("pointerdown", function (e) {
    currentPiece = piece;

    let rect = piece.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    piece.style.zIndex = 9999;
    piece.setPointerCapture(e.pointerId);
  });

  piece.addEventListener("pointermove", function (e) {
    if (!currentPiece) return;

    currentPiece.style.left = (e.clientX - offsetX) + "px";
    currentPiece.style.top = (e.clientY - offsetY) + "px";
  });

  piece.addEventListener("pointerup", function (e) {
    if (!currentPiece) return;

    checkDrop(currentPiece);

    currentPiece.releasePointerCapture(e.pointerId);
    currentPiece = null;
  });

});

// ---------------- DROP CHECK ----------------

function checkDrop(piece) {
  let pieceClass = piece.classList[0];
  let pieceRect = piece.getBoundingClientRect();

  let pieceCenterX = pieceRect.left + pieceRect.width / 2;
  let pieceCenterY = pieceRect.top + pieceRect.height / 2;

  document.querySelectorAll("#puz i").forEach(function (slot) {

    if (slot.classList.contains("dropped")) return;

    let slotRect = slot.getBoundingClientRect();

    let slotCenterX = slotRect.left + slotRect.width / 2;
    let slotCenterY = slotRect.top + slotRect.height / 2;

    let distance = Math.sqrt(
      Math.pow(pieceCenterX - slotCenterX, 2) +
      Math.pow(pieceCenterY - slotCenterY, 2)
    );

    // if close enough
    if (distance < 60) {

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

    setTimeout(function () {
      reloadPuzzle();
      randomizeImage();
    }, 1000);
  }
}
