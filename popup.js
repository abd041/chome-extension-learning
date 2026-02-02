let count = 0;

const countElement = document.getElementById("countel");
const countBtn = document.getElementById("countbtn");
const minusBtn = document.getElementById("minusbtn");

renderCount()

countBtn.addEventListener("click", () => {
    count++;
    countElement.textContent = count;

    localStorage.setItem("count" , count)
});

minusBtn.addEventListener("click", () => {
    if (count > 0) {
        count--;
    }

    countElement.textContent = count;
    localStorage.setItem("count" , count)
});


function renderCount(){
if(localStorage.getItem("count")){
  count = localStorage.getItem("count")
  countElement.textContent = count;

}
}