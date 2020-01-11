const BASE_URL = 'http://localhost:3000'
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const parentContainer = document.getElementsByTagName('main')[0]

let obj

const trainersFetchCall = () => (window.fetch(TRAINERS_URL)
  .then(resp => resp.json())
  .then(data => obj = data)
  .then(data => data.forEach(appendTrainers))
)

trainersFetchCall()

function appendTrainers (trainer) {
  const div = document.createElement('div')
  div.className = 'card'
  div.dataset.id = trainer.id

  const p = document.createElement('p')
  p.innerText = trainer.name

  const button = document.createElement('button')
  button.innerText = 'Add Pokemon'
  button.dataset.trainerId = trainer.id

  const ul = document.createElement('ul')

  trainer.pokemons.forEach(function (pokemon) {
    const li = document.createElement('li')
    li.innerText = `${pokemon.nickname} (${pokemon.species})`

    const button = document.createElement('button')
    button.className = 'release'
    button.dataset.pokemonId = pokemon.id
    button.innerText = 'Release'

    li.appendChild(button)
    ul.appendChild(li)
  })

  div.appendChild(p)
  div.appendChild(button)
  div.appendChild(ul)
  parentContainer.appendChild(div)
};

function addPokemon (obj, e) {
  // find div card where data_id matches trainer_id
  const ul = e.target.nextSibling
  const li = document.createElement('li')
  li.innerText = `${obj.nickname} (${obj.species})`
  const button = document.createElement('button')
  button.className = 'release'
  button.innerText = 'Release'

  li.appendChild(button)
  ul.appendChild(li)
}

function avaliableTeamSpot (e) {
  // returns true or false
  const currentPokemons = obj.filter(trainer => trainer.id == e.target.dataset.trainerId)[0].pokemons
  return currentPokemons.length < 6
}

function generatePokemon (e) {
  if (avaliableTeamSpot(e)) {
    fetch(POKEMONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ trainer_id: `${e.target.dataset.trainerId}` })
    })
      .then(resp => resp.json())
      .then(obj => addPokemon(obj, e))
  }
};

function removePokemon (e) {
  const parentLi = e.target.parentNode
  const parentUl = parentLi.parentNode
  parentUl.removeChild(parentLi)
}

function releasePokemon (e) {
  fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ id: `${e.target.dataset.pokemonId}` })
  })
    .then(removePokemon(e))
};

parentContainer.addEventListener('click', function (e) {
  e.stopPropagation()

  if (e.target.innerText === 'Add Pokemon') {
    generatePokemon(e)
  } else if (e.target.innerText === 'Release') {
    releasePokemon(e)
  };
})
