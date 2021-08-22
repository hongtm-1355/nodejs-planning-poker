
const showCardEle = document.getElementById('showCard')
const resetCardEle = document.getElementById('resetCard')


const makePositionPlayer = players => {
  const map = {
    top: [],
    right: [],
    bottom: [],
    left: []
  }

  players.forEach((i, idx) => {
    const index = idx + 1
    if (index == 1) {
      map.top.push(i)
    } else if (index == 2) {
      map.right.push(i)
    } else if (index == 3) {
      map.bottom.push(i)
    } else if (index == 4) {
      map.left.push(i)
    } else if (index % 2 == 1) {
      map.top.push(i)
    } else if (index % 2 == 0) {
      map.bottom.push(i)
    }
  })

  return map
}

function renderCards(users, id) {
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
    const node = addCard(i.userName, i.id)
    $tableTop.appendChild(node)
  })

  map.bottom.forEach(i => {
    const node = addCard(i.userName, i.id)
    $tableBottom.appendChild(node)
  })

  map.right.forEach(i => {
    const node = addCard(i.userName, i.id)
    $tableRight.appendChild(node)
  })

  map.left.forEach(i => {
    const node = addCard(i.userName, i.id)
    $tableLeft.appendChild(node)
  })

  const btnChooseElements = document.getElementsByClassName('btn-choose-card')
  // const concac = document.getElementById('me')
  // console.log(concac.classList)

  // Array.from(btnChooseElements).forEach(ele => {
  //   ele.addEventListener('click', function(e) {
  //     console.log('onlick')
  //     Array.from(btnChooseElements).forEach(_ele => {
  //       if (_ele.value == e.target.value) {
  //         _ele.closest('.Room-module--card').classList.add("Room-module--card-active")

  //         concac.classList.remove('Player-module--card-empty', 'Player-module--container')
  //         // concac.classList.add('Player-module--card')
  //         addCardPicture(_ele, concac)

  //         isSelect = true
  //         showCardEle.removeAttribute("disabled");
  //       }
  //       else _ele.closest('.Room-module--card').classList.remove("Room-module--card-active")
  //     })
  //   })
  // });
}


window.addEventListener('load', function() {
  console.log("RELEASE PLAY")


  const roomId = location.pathname.replace('/new-game/play/', '')
  const urlSearchParams = new URLSearchParams(location.search)
  const params = Object.fromEntries(urlSearchParams.entries())

  socket.emit('join', { userName: params.name, room: roomId }, (user) => {
    console.log(user)
    console.log('A new Connected')
    this.localStorage.setItem('user', JSON.stringify(user))
    socket.emit('getUser', (users) => {
      renderCards(users)
    })
  })

  socket.on('updateUser', (users, id) => {
    console.log('Updated Users', users)
    renderCards(users, id)
  })

  socket.on('updateChooseCard', user => {
    console.log('tao ne')
    addCardPicture(user.point, user.id)
  })


  // const users = new Array(parseInt(params.num)).fill(0).map((i, idx) => {
  //   return { id: Math.random().toString(36).slice(2), userName: `Test ${idx + 1}`, point: null, owner: idx == 0}
  // })
})
