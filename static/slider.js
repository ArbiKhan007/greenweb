var slider = document.getElementById("rangetool");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
// setInterval(calcVal(), 2000);

function calcVal(){
  slider.oninput = function() {
    output.innerHTML = this.value;
  }
}

calcVal();