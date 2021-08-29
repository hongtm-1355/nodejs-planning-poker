const _createElement = (eleType, option) => {
  // options: { value: string, classes: Array, id: string}

  const node = document.createElement(eleType)
  const { innerText, classes, id } = option

  if (innerText) node.innerText = innerText
  if (classes) node.classList.add(...classes)
  if (id) node.id = id

  return node
}

function addCard(userName, userId, owner) {
  const star = owner ? '⭐' : ''
  const cardTemplate = `
    <div class="Table-module--player-container">
      <div class="Table-module--player-warp">
        <div class="Player-module--container Player-module--card-empty" id={{ userId }}></div>
        <div class="Player-module--player-name">{{ star }} {{ userName }}</div>
      </div>
    </div>
  `

  return Mustache.render(cardTemplate, {
    userId: userId,
    userName: userName,
    star: star
  })
}

function addCardPicture(point, userID) {
  console.log(point, userID)
  const pictureTemplate = `
    <div class="Player-module--card Card-module--downwards">
      <div class="Card-module--value">
        <div class="CardValue">{{ point }}</div>
      </div>
      <div class="Card-module--PictureSlide">
        <div class="Card-module--PictureBox"></div>
      </div>
    </div>
  `

  const html = Mustache.render(pictureTemplate, { point })
  const $me = document.getElementById(userID)

  $me.innerHTML = ''
  $me.classList.remove('Player-module--card-empty', 'Player-module--container')
  $me.insertAdjacentHTML('beforeend', html)
}


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


const toggleVisibleBy = ($ele, options = { show: 'show', hide: 'hidden' }) => {
  if ($ele.classList.contains(options.show)) {
    $ele.classList.remove(options.show)
    $ele.classList.add(options.hide)
  } else {
    $ele.classList.remove(options.hide)
    $ele.classList.add(options.show)
  }
}
