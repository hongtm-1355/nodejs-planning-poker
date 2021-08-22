const _createElement = (eleType, option) => {
  // options: { value: string, classes: Array, id: string}

  const node = document.createElement(eleType)
  const { innerText, classes, id } = option

  if (innerText) node.innerText = innerText
  if (classes) node.classList.add(...classes)
  if (id) node.id = id

  return node
}

function addCard(userName, userId) {
  // div.Table-module--player-container
    // div.Table-module--player-warp
    //   div.Player-module--container.Player-module--card-empty#userID
    //   div.Player-module--player-name Fuckyou

  const divPlayerContainer = _createElement('div', { classes: ['Table-module--player-container'] })
  const divPlayerWarp      = _createElement('div', { classes: ['Table-module--player-warp'] })
  const divCardEmpty       = _createElement('div', { classes: ['Player-module--container', 'Player-module--card-empty'], id: userId })
  const divPlayerName      = _createElement('div', { classes: ['Player-module--player-name'], innerText: userName })

  divPlayerWarp.appendChild(divCardEmpty)
  divPlayerWarp.appendChild(divPlayerName)

  divPlayerContainer.appendChild(divPlayerWarp)

  return divPlayerContainer
}


function addCardPicture(point, userID) {
  const $me = document.getElementById(userID)
  $me.innerHTML = ''
  $me.classList.remove('Player-module--card-empty', 'Player-module--container')

  const divContainer = _createElement('div', { classes: ['Player-module--card', 'Card-module--downwards'] })
  const divCardModuleValue = _createElement('div', { classes: ['Card-module--value'] })
  const divCardValue = _createElement('div', { classes: ['CardValue'], innerText: point })
  const divCardModulePictureBox = _createElement('div', { classes: ['Card-module--PictureBox'] })


  divCardModuleValue.appendChild(divCardValue)
  divContainer.appendChild(divCardModuleValue)
  divContainer.appendChild(divCardModulePictureBox)
  $me.appendChild(divContainer)
}
