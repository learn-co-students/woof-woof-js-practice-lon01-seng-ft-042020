document.addEventListener('DOMContentLoaded', () => {

    getAllDogs();

})

const dogsURL = `http://localhost:3000/pups/`
const dogBar = document.getElementById('dog-bar');
const dogInfo = document.getElementById('dog-info');
const filterButton = document.getElementById('good-dog-filter');

function createDogSpan(dog) {
    const span = document.createElement('span');
    span.innerText = dog.name;
    span.addEventListener('click', e => dogShowPage(e, dog))

    return span
}

function renderDog(dog) {
    const span = createDogSpan(dog);
    dogBar.append(span);
}

function renderAllDogs(dogsArray) {
    dogBar.innerHTML = ''
    dogsArray.forEach(dog => renderDog(dog));
}

function getAllDogs() {
    fetch(dogsURL)
    .then(resp => resp.json())
    .then(dogsArray => renderAllDogs(dogsArray))
    .catch(error => console.log(error))
}


function dogShowPage(e, dog) {
    dogInfo.innerHTML = ''
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = dog.image;
    const p = document.createElement('p');
    p.innerText = dog.name;
    const button = document.createElement('button');

    if (dog.isGoodDog === true) {
        button.innerText = 'Good Dog!'
    } else {
        button.innerText = 'Bad Dog!'
    }

    button.addEventListener('click', e => goodDog(e, dog, button))

    div.append(img, p, button);
    dogInfo.append(div);
}

function goodDog(e, dog, button) {
    if (dog.isGoodDog === true) {
        dog.isGoodDog = false
    } else {
        dog.isGoodDog = true
    }
    let object = {
    isGoodDog: dog.isGoodDog
    };
    
    let configObject = {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(object)
    };
    
    fetch(`${dogsURL}${dog.id}`, configObject)
    .then(resp => resp.json())
    .then(dog => {
        if (dog.isGoodDog === true) {
            button.innerText = 'Good Dog!'
        } else {
            button.innerText = 'Bad Dog!'
        }
    })
    .catch(error => console.log(error));
}

filterButton.addEventListener('click', e => showGoodDogs(e, filterButton));

function showGoodDogs(e, filterButton) {
    if (filterButton.innerText === 'Filter good dogs: OFF') {
        filterButton.innerText = 'Filter good dogs: ON'
        fetch(dogsURL)
        .then(resp => resp.json())
        .then(dogsArray => {
            const goodDogsArray = dogsArray.filter(dog => dog.isGoodDog === true)
            renderAllDogs(goodDogsArray)})
        .catch(error => console.log(error))

    } else {
        filterButton.innerText = 'Filter good dogs: OFF'
        getAllDogs();
    }
}