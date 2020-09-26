
//client side javascriptvar button = document.querySelectorAll(".replied")
//This is main.js
var trash = document.getElementsByClassName("fa-trash");
var button = document.querySelectorAll(".replied")
console.log(button)




Array.from(button).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(element.value)
        const name = this.parentNode.children[0].innerHTML
        const order = this.parentNode.children[1].innerHTML
        // "this" is set to the element that has received the event which is the button
        const barista = this.parentNode.querySelector('#barista').value
        var msg = new SpeechSynthesisUtterance();
        console.log(order)
        console.log(name)
        msg.text = `${name} your ${order} is ready made by ${barista}`;
        window.speechSynthesis.speak(msg);
        fetch('/order',{
          method: 'put',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify({
           callBack: true,
             id: element.value,
             barista: barista
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(this.parentNode.parentNode.childNodes)
        const id = this.parentNode.parentNode.childNodes[11].dataset.id
        // console.log(id)
        fetch('/order', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: id

          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
