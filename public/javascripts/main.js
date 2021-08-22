const socket = io()
window.addEventListener('load', function() {
  console.log('All assets are loaded')

  const btnChooseElements = document.getElementsByClassName('btn-choose-card')
  const concac = document.getElementById('me')
  const showCardEle = document.getElementById('showCard')
  const resetCardEle = document.getElementById('resetCard')

  let isSelect = false

  showCardEle.addEventListener('click', function() {
    const eles = document.getElementsByClassName('Player-module--card')
    Array.from(eles).forEach(_ele => {
      _ele.classList.remove("Card-module--downwards")
    })
    resetCardEle.classList.remove('hidden')
    resetCardEle.classList.add('show')

    showCardEle.classList.remove('show')
    showCardEle.classList.add('hidden')
  })

  resetCardEle.addEventListener('click', function() {
    const eles = document.getElementsByClassName('Player-module--card')
    Array.from(eles).forEach(_ele => {
      // _ele.classList.remove("Card-module--downwards")
      _ele.parentNode.classList.add('Player-module--card-empty', 'Player-module--container')
      _ele.parentNode.removeChild(_ele)
    })
    resetCardEle.classList.remove('show')
    resetCardEle.classList.add('hidden')

    showCardEle.classList.remove('hidden')
    showCardEle.classList.add('show')

    showCardEle.setAttribute("disabled" ,"true");
    isSelect = false

    Array.from(document.getElementsByClassName('Room-module--card')).forEach(element => {
      element.classList.remove("Room-module--card-active")
    });
  })

  Array.from(btnChooseElements).forEach(ele => {
    ele.addEventListener('click', function(e) {
      Array.from(btnChooseElements).forEach(_ele => {
        if (_ele.value == e.target.value) {
          _ele.closest('.Room-module--card').classList.add("Room-module--card-active")
          isSelect = true
          showCardEle.removeAttribute("disabled");
          socket.emit('chooseCard', { userId:  JSON.parse(localStorage.getItem('user'))?.id, point: _ele.value}, user => {
            addCardPicture(_ele.value, user.id)
          })
        }
        else _ele.closest('.Room-module--card').classList.remove("Room-module--card-active")
      })
    })
  });
})
