let count = 0;

let countElement = document.getElementById("countel");
let countBtn = document.getElementById("countbtn");

countBtn.addEventListener("click", () => {
    count++;
    countElement.innerHTML = count;
});