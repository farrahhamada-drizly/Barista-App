
//client side javascript


var button = document.querySelectorAll(".replied")
console.log(button)

Array.from(button).forEach(function(element) {
      element.addEventListener('click', function(){
        var msg = new SpeechSynthesisUtterance();
        msg.text = "Hello World";
        window.speechSynthesis.speak(msg);
        console.log("replied")

      });
});
