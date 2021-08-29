const socket = io()

function objectifyForm(formArray) {
  //serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}

function renderCards(users, id) {
  console.log('render', users)
  const $tableTop    = document.querySelector('#table-top')
  const $tableRight  = document.querySelector('#table-right')
  const $tableLeft   = document.querySelector('#table-left')
  const $tableBottom = document.querySelector('#table-bottom')

  $tableTop.innerHTML = ''
  $tableRight.innerHTML = ''
  $tableLeft.innerHTML = ''
  $tableBottom.innerHTML = ''

  const map = makePositionPlayer(users)

  map.top.forEach(i => {
    const html = addCard(i.name, i.id, i.owner)
    $tableTop.insertAdjacentHTML('beforeend', html)

    if (i.point) addCardPicture(i.point, i.id)
  })

  map.bottom.forEach(i => {
    const html = addCard(i.name, i.id, i.owner)
    $tableBottom.insertAdjacentHTML('beforeend', html)

    if (i.point) addCardPicture(i.point, i.id)
  })

  map.right.forEach(i => {
    const html = addCard(i.name, i.id, i.owner)
    $tableRight.insertAdjacentHTML('beforeend', html)

    if (i.point) addCardPicture(i.point, i.id)
  })

  map.left.forEach(i => {
    const html = addCard(i.name, i.id, i.owner)
    $tableLeft.insertAdjacentHTML('beforeend', html)

    if (i.point) addCardPicture(i.point, i.id)
  })
}

const joinGame = (player) => {
  const roomId = location.pathname.replace('/game/play/', '')
  console.log(roomId, player)
  socket.emit('join', { player, roomId }, (user) => {
    console.log(`${JSON.stringify(user)} connected`)
    this.localStorage.setItem('player', JSON.stringify(user))
    $('.Header-Game--player-name-label')[0].innerText = user.name

    // socket.emit('getUser', roomId, (users) => {
    //   console.log('renderUsers')
    //   renderCards(users)
    // })
  })
}


window.addEventListener('load', function() {
  const urlSearchParams = new URLSearchParams(location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  const $btnChooseElements = document.getElementsByClassName('btn-choose-card')
  const $showCardEle       = document.getElementById('showCard')
  const $resetCardEle      = document.getElementById('resetCard')

  const player = JSON.parse(localStorage.getItem('player'))

  if (!player || Object.keys(player).length == 0) {
    $('#editNameModal').modal('show')
  } else {
    console.log(player)
    joinGame(player)
  }

  const showAllCard = () => {
    const roomId = location.pathname.replace('/game/play/', '')
    socket.emit('showResult', roomId, () => {
      const $elements = document.getElementsByClassName('Player-module--card')
      Array.from($elements).forEach(_ele => {
        _ele.classList.remove("Card-module--downwards")
      })
      toggleVisibleBy($resetCardEle)
      toggleVisibleBy($showCardEle)
    })
  }

  const resetAllCard = () => {
    const roomId = location.pathname.replace('/game/play/', '')
    socket.emit('resetResult', roomId, () => {
      const $elements = document.getElementsByClassName('Player-module--card')

      Array.from($elements).forEach(_ele => {
        _ele.parentNode.classList.add('Player-module--card-empty', 'Player-module--container')
        _ele.parentNode.removeChild(_ele)
      })
      toggleVisibleBy($resetCardEle)
      toggleVisibleBy($showCardEle)

      $showCardEle.setAttribute("disabled" ,"true");
      isSelect = false

      Array.from(document.getElementsByClassName('Room-module--card')).forEach(element => {
        element.classList.remove("Room-module--card-active")
      });
    })
  }

  const selectPoint = (e) => {
    Array.from($btnChooseElements).forEach(_ele => {
      if (_ele.value == e.target.value) {
        _ele.closest('.Room-module--card').classList.add("Room-module--card-active")
        isSelect = true
        $showCardEle.removeAttribute("disabled");
        const roomId = location.pathname.replace('/game/play/', '')
        const user = JSON.parse(localStorage.getItem('player'))
        console.log(roomId, location.pathname)
        socket.emit('chooseCard', { roomId, point: _ele.value, userId: user.id }, () => {
          addCardPicture(_ele.value, user.id)
        })
      }
      else _ele.closest('.Room-module--card').classList.remove("Room-module--card-active")
    })
  }

  Array.from($btnChooseElements).forEach(ele => {
    ele.addEventListener('click', selectPoint)
  });

  $showCardEle.addEventListener('click', showAllCard)
  $resetCardEle.addEventListener('click', resetAllCard)

  $('#updatePlayerBtn').on('click', (e) => {
    console.log('update player')
    const player = objectifyForm($('#updatePlayerForm').serializeArray())
    console.log(player)
    joinGame(player)
    $('#editNameModal').modal('hide')
  })



  socket.on('updateUser', (users) => {
    console.log('Update Users', users)
    renderCards(users)
  })

  socket.on('updateChooseCard', user => {
    addCardPicture(user.point, user.id)
  })

  socket.on('updateCard', () => {
    const $elements = document.getElementsByClassName('Player-module--card')
    console.log('update card')
    Array.from($elements).forEach(_ele => {
      _ele.classList.remove("Card-module--downwards")
    })
    toggleVisibleBy($resetCardEle)
    toggleVisibleBy($showCardEle)
  })

  socket.on('updateResetCard', () => {
    const $elements = document.getElementsByClassName('Player-module--card')

    Array.from($elements).forEach(_ele => {
      _ele.parentNode.classList.add('Player-module--card-empty', 'Player-module--container')
      _ele.parentNode.removeChild(_ele)
    })
    toggleVisibleBy($resetCardEle)
    toggleVisibleBy($showCardEle)

    $showCardEle.setAttribute("disabled" ,"true");
    isSelect = false

    Array.from(document.getElementsByClassName('Room-module--card')).forEach(element => {
      element.classList.remove("Room-module--card-active")
    });
  })
})
