function $(id) {
 return document.getElementById(id);
}

const canvasPicture = {
 canvas: $("picture"),
 ctx: $("picture").getContext("2d"),
}
const fullCanvas = {
 canvas: $("fscanvas"),
 ctx: $("fscanvas").getContext("2d"),
}
window.onerror = () => {
 console.log(arguments);
};
const fetchedStorage = {};
const fetchFile = (_directory, respType) => {
 let _d = _directory.split("./");
 let directory = (`${_d[_d.length - 1]}`).replace(new RegExp("//", "gm"), "/");
 return new Promise((res, rej) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = "arraybuffer";
  xhr.onreadystatechange = (event) => {
   //console.log(directory, event.target.readyState, event.target.status);
   if (event.target.readyState === 4 && event.target.status === 200) {

    var uint8Array = new Uint8Array(xhr.response);
    var i = uint8Array.length;
    var binaryString = [];
    while (i--) {
     binaryString[i] = String.fromCharCode(uint8Array[i]);
    }
    var data = binaryString.join('');

    var base64 = window.btoa(data);

    fetchedStorage[directory] = base64;
    //console.log(atob(base64))

    let type = {
     text: () => atob(base64),
     blob: () => new Blob([uint8Array]),
     base64: () => base64

    } [respType || "text"];
    //console.log(type())
    res(type());
   };
   if (event.target.readyState === 4 && event.target.status === 404) {

    res("404: EricLenovo System does not find a file: no such file or directory.");
   };
   //console.log(event.target.readyState, event.target.status);

  }
  xhr.open('GET', directory, true);
  xhr.send();
 })
}


function loadWeb() {
 return new Promise(async (res, rej) => {
  for (let b of WORD_BANK) {
   let loaded = await loadImgCanvas(b.src);
   current.elements[b.src] = loaded;
  }
  for (let n of ["correct.png", "wrong.png"]) {
   let mm = await loadImgCanvas(n);
   current.elements[n] = mm;
  }/**/
  res();
 });
}

function loadImgCanvas(b) {
 return new Promise(async (res, rej) => {

  let imgRaw = await fetchFile(`./files/${b}`, "blob");

  let img = new Image();
  try {

   img.src = window.URL.createObjectURL(imgRaw);
   img.onload = () => {
    let canvas = new OffscreenCanvas(img.width, img.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    res(canvas);


   };
  } catch (e) {
   res(new Image());
  }

 });
} /**/
var current = {
 cellsize: 0,
 current: 0,
 width: 0,
 height: 0,
 sorted: [3,1,0,2,4],
 elements: {},
 currentSorted: 0,
 revealed: false,
 denoted: false,
};

const WORD_BANK = [
 {
  src: "gh.jpeg",
  word: "GREENHOUSEGASES",
  quote: "Hangin na may Luntiang Bahay",
  denotedm: "Ang mga gas sa atmospera na nagpapataas ng temperatura sa ibabaw ng mga planeta tulad ng Earth.",
  wcount: [10, 5]
 },
 {
  src: "uv.jpeg",
  word: "ULTRAVIOLETLIGHT",
  quote: "Sobra na ang kulay ube",
  denotedm: "Isang rayong nasa sikat ng araw, at bumubuo ng halos 10% ng kabuuang electromagnetic radiation na output mula sa Araw.",
  wcount: [11, 5]
 },
 {
  src: "gw.png",
  word: "GLOBALWARMING",
  quote: "Biglang uminit na ang bola!",
  denotedm: "Ang pagkakulong ng init na nagmumula sa araw na tumatama sa daigdig dahil sa paggamit ng mga gas na humaharang upang makalabas ang init na mula sa mundo patungo sa kalawakan",
  wcount: [6,7]
 },
 {
  src: "defo.jpeg",
  word: "DEFORESTATION",
  quote: "Patag na ang mga punongkahoy at wala nang mga dahon.",
  denotedm: "Ito ay tumutukoy sa pagkakalbo ng kagubatan dahil sa pagtrotroso o pagsusunog ng mga puno",
  wcount: [13]
 },
 {
  src: "cc.jpeg",
  word: "CLIMATECHANGE",
  quote: "Suklima: Sukli sa matagal-tagal na panahon",
  denotedm: "Pagbabago ng panahon sa matagal na panahon",
  wcount: [7, 6]
 },
];

function rambol(name) {
 current.name = name;
 let a = WORD_BANK[name];
 let jumbled = a.word.split("").sort(() => Math.random() - 0.5);
 if (!("rambol" in a)) a.rambol = jumbled;
 let b = createRambol(a.wcount, a.rambol);
 $("question").innerHTML = a.quote;
 $("rambol").style.color = "#fff";
 $("rambol").innerHTML = b; 
 $("answer").value = "";
 let ma = $("answer").value.trim();
 $("btn-ramrev").style.display = ma == "" ? "none" : "flex";
 $("btn-check").style.display = ma == "" ? "none" : "flex";
 canvasPicture.ctx.clearRect(0,0,1280,720);
 current.denoted = false;
 current.revealed = false;
 
 $("question").style.color = current.denoted ? "#ffa": "#fff";
 
 canvasPicture.ctx.drawImage(current.elements[a.src], 0, 0, 1280, 720);
}

function denote() {
 let a = WORD_BANK[current.sorted[current.currentSorted]];
 
 current.denoted = !current.denoted;
 
 if (current.denoted) {
  
 }
 
 $("question").innerHTML = current.denoted ? a.denotedm : a.quote;
 $("question").style.color = current.denoted ? "#ffa": "#fff";
}



/*function createRambolLetters(wc, arr, jumArr) {
 current.elements = {};
 let sz = 3;
 let ram = [];
 $("rambol-div").innerHTML = "";
 let count = 0;
 let mcount = -1,
  mword = 0;
  let length = 0;
 for (let n of arr) {
  let m = n;
  let el = n;
  mcount++;
  do {
      let p = false;

   if (mcount + 1>= wc[mword]) {
    mcount = -1;
    mword++;
    //count--;
    p = true;
   }
   if (!p) ram.push(length - mword);
   length++;
   
   if (!p) break;
  } while (false);
  count++;
 }
 for (let qw of jumArr) {
  let temp = g
 }
 count = 0,
  mcount = -1,
  mword = 0;
 let used = 0;
 for (let n of arr) {
  let m = n;
  let restore = n;
  let el = n;
  do {
   let p = false;
   m = restore;
   el = restore;
   if (mcount + 1 >= wc[mword]) {
    mcount = -1;
    mword++;
    m = "$";
    el = "nbsp";
    
    //count-=1;
    p = true;
    console.log("space")
   }

   console.log(mcount, el)
   let a = current.elements;
   a[`letter-${el}${count}`] = document.createElement("leter");
   let h = a[`letter-${el}${count}`];
   h.innerHTML = m;
   h.id = `letter-${el}${count}`;
   h.className = "lettering";
   h.style.position = "absolute";
   h.style.background = "#7353";
   h.style.fontSize = `${sz*current.cellsize}px`;
   h.style.width = current.cellsize * sz + "px";
   h.style.height = current.cellsize * sz + "px";
   h.style.transform = `translateX(${(current.cellsize * (sz / 1.2) * (mword + ram[used])) - (current.cellsize * length * 1.2)}px)`
   $("rambol-div").appendChild(h);
   used++;

   if (!p) break;
  } while (true);
  count++;
  mcount++;
 }
}*/

function createRambol(wc, ram) {
 //$("rambol-div").innerHTML = "";
 let count = 0;
 let mcount = -1,
  mword = 0;
 let length = 0;
 let a = "";
 for (let n of ram) {
  let m = n;
  let restore = n;
  do {
   m = restore;
   let p = false;

   if (mcount + 1 >= wc[mword]) {
    mcount = -1;
    mword++;
    //count--;
    p = true;
   }
   if (p) m = "&nbsp&nbsp";
   a += m;
   if (!p) break;
  } while (true);
  count++;
  mcount++;
 }

 return a;
}


function reveal() {
 let a = WORD_BANK[current.sorted[current.currentSorted]];
 current.revealed = !current.revealed;
 
  let b = createRambol(a.wcount, current.revealed ? a.word.split("") : a.rambol);
 $("rambol").style.color = current.revealed ? "#0f0" :  "#fff";
 $("rambol").innerHTML = b; 
}

function check() {
 let query = $("answer").value.trim();
 if (query === "") return;
 let a = WORD_BANK[current.sorted[current.currentSorted]].word;
 
 let b = query.toUpperCase().split(" ").join("");
 
 if (a === b) {
  while (!current.revealed) {
   reveal();
  }
  fullCanvas.ctx.drawImage(current.elements["correct.png"], 0, 0, 1280, 720);
  fullCanvas.canvas.style.display = "flex";
  
 } else {
  fullCanvas.ctx.drawImage(current.elements["wrong.png"], 0, 0, 1280, 720);
  fullCanvas.canvas.style.display = "flex";
 }
 console.log(query);
}

function resize() {
 let s = current;
 s.width = window.innerWidth;
 s.height = window.innerHeight;
 let min = Math.min(s.width, s.height);
 let cellSize = min / 40;
 s.cellsize = cellSize;
 document.documentElement.style.fontSize = cellSize + "px";
 $("core").style.width = `${cellSize*40*(16/9)}px`;
 $("core").style.height = `${cellSize*40}px`;
 $("head").style.width = `${cellSize*40*(16/9)}px`;
 $("head").style.height = `${cellSize*2}px`;
 $("content").style.width = `${cellSize*40*(16/9)}px`;
 $("content").style.height = `${cellSize*37}px`;
 
 $("fscanvas").style.width = `${cellSize*40*(16/9)}px`;
 $("fscanvas").style.height = `${cellSize*40}px`;

 $("question-div").style.width = `${cellSize*40*(16/9)}px`;
 $("question-div").style.height = `${cellSize*7}px`;
 $("picture-div").style.width = `${cellSize*40*(16/9)}px`;
 $("picture-div").style.height = `${cellSize*22}px`;
 $("rambol-div").style.width = `${cellSize*40*(16/9)}px`;
 $("rambol-div").style.height = `${cellSize*3}px`;
 $("answer-div").style.width = `${cellSize*40*(16/9)}px`;
 $("answer-div").style.height = `${cellSize*3}px`;
 $("control-div").style.width = `${cellSize*40*(16/9)}px`;
 $("control-div").style.height = `${cellSize*3}px`;

 $("picture").style.width = `${cellSize*22*(16/9)}px`;
 $("picture").style.height = `${cellSize*22}px`;
}

for (let j of ["resize", "DOMContentLoaded"]) {
 window.addEventListener(j, () => {
  resize();
 });
}

window.addEventListener("DOMContentLoaded", async () => {
 await loadWeb();
 current.currentSorted--;
 if (current.currentSorted < -1) {
  current.currentSorted = -1;
 }

 if (current.currentSorted == -1) {
  $("question").innerHTML = "";
  $("rambol").style.color = "#fff";
  $("rambol").innerHTML = "";
  canvasPicture.ctx.clearRect(0, 0, 1280, 720);
  $("answer").value = "";
 let a = $("answer").value.trim();
 $("btn-ramrev").style.display = a == "" ? "none" : "flex";
 $("btn-check").style.display = a == "" ? "none" : "flex";
  current.denoted = false;
  current.revealed = false;
 }
 
})

$("btn-prev").onclick = () => {
 current.currentSorted--;
 if (current.currentSorted < -1) {
  current.currentSorted = -1;
 }
 
 if (current.currentSorted == -1) {
  $("question").innerHTML = "";
  $("rambol").style.color = "#fff";
  $("rambol").innerHTML = ""; 
  canvasPicture.ctx.clearRect(0,0,1280,720);
  $("answer").value = "";
 let a = $("answer").value.trim();
 $("btn-ramrev").style.display = a == "" ? "none" : "flex";
 $("btn-check").style.display = a == "" ? "none" : "flex";
 current.denoted = false;
 current.revealed = false;
 }
 else rambol(current.sorted[current.currentSorted]);
}

$("btn-next").onclick = () => {
 current.currentSorted++;
 if (current.currentSorted > 4) current.currentSorted = 4;
 rambol(current.sorted[current.currentSorted]);
}

$("btn-hint").onclick = denote;

$("btn-ramrev").onclick = reveal;

$("btn-check").onclick = check;

$("fscanvas").onclick = () => {
  fullCanvas.canvas.style.display = "none";
  
}

$("answer").oninput = () => {
 let a = $("answer").value.trim();
 $("btn-ramrev").style.display = a == "" ? "none" : "flex";
 $("btn-check").style.display = a == "" ? "none" : "flex";
 
}