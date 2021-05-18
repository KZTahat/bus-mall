'use strict';

let attempts = 0;
let maxAttempts = 20;
let ProductsNames = [];
let numberOfClicks = [];
let numberOfVeiws = [];

let objectsArray = [];
function Product(productName) {
    this.productName = productName.split('.')[0];
    this.imageSource = 'Images/' + productName;
    this.veiws = 0;
    this.clicks = 0;

    objectsArray.push(this);
}

let ImagesArray = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg'];
for (let i = 0; i < ImagesArray.length; i++) {
    new Product(ImagesArray[i]);
}
console.log(objectsArray);
function randomImage() {
    return Math.floor(Math.random() * objectsArray.length);
}

//............................... getting Elements by Id 
let attemptsElement = document.getElementById('attemptsNumber');
let leftImage = document.getElementById('leftImage');
let middelImage = document.getElementById('middelImage');
let rightImage = document.getElementById('rightImage');
let unorderdList = document.getElementById('results');

attemptsElement.textContent = attempts;

let leftImageIndex;
let middelImageIndex;
let rightImageIndex;

let firstIterationIndexes = [];

// .............................. Image Render Function
function getThreeImages() {
    leftImageIndex = randomImage();
    middelImageIndex = randomImage();
    rightImageIndex = randomImage();

    while ((leftImageIndex === firstIterationIndexes[0] || leftImageIndex === firstIterationIndexes[1] || leftImageIndex === firstIterationIndexes[2]) || (middelImageIndex === firstIterationIndexes[0] || middelImageIndex === firstIterationIndexes[1] || middelImageIndex === firstIterationIndexes[2]) || (rightImageIndex === firstIterationIndexes[0] || rightImageIndex === firstIterationIndexes[1] || rightImageIndex === firstIterationIndexes[2]) || ((leftImageIndex === middelImageIndex) || (leftImageIndex === rightImageIndex) || (middelImageIndex === rightImageIndex))) {
        leftImageIndex = randomImage();
        middelImageIndex = randomImage();
        rightImageIndex = randomImage();
    }
    console.log(leftImageIndex);
    console.log(middelImageIndex);
    console.log(rightImageIndex);
    console.log('previous indexes : ', firstIterationIndexes);

    leftImage.setAttribute('src', objectsArray[leftImageIndex].imageSource);
    leftImage.setAttribute('title', objectsArray[leftImageIndex].productName);
    leftImage.setAttribute('alt', objectsArray[leftImageIndex].productName);
    objectsArray[leftImageIndex].veiws++; // Incrementing Left Image Veiws

    middelImage.setAttribute('src', objectsArray[middelImageIndex].imageSource);
    middelImage.setAttribute('title', objectsArray[middelImageIndex].productName);
    middelImage.setAttribute('alt', objectsArray[middelImageIndex].productName);
    objectsArray[middelImageIndex].veiws++; // Incrementing Middel Image Veiws

    rightImage.setAttribute('src', objectsArray[rightImageIndex].imageSource);
    rightImage.setAttribute('title', objectsArray[rightImageIndex].productName);
    rightImage.setAttribute('alt', objectsArray[rightImageIndex].productName);
    objectsArray[rightImageIndex].veiws++; // Incrementing Right Image Veiws

    firstIterationIndexes = [leftImageIndex, middelImageIndex, rightImageIndex];//to store the current Indexes to use om the next one
    settingItems();//setting the new Item into the local storage of the browser
}
gettingItems();
getThreeImages();//..Only for First Time Call

// .........................setting and getting objects to and from the local storage
function settingItems(){
    localStorage.setItem('Product',JSON.stringify(objectsArray));
}
function gettingItems(){
    let data = JSON.parse(localStorage.getItem('Product'));
    if (data) {objectsArray = data;}
}

// ...........................................Adding Event Listners
leftImage.addEventListener('click', clicks);
middelImage.addEventListener('click', clicks);
rightImage.addEventListener('click', clicks);

function clicks(event) {
    attempts++;
    if (attempts <= maxAttempts) {
        attemptsElement.textContent = attempts;
        if (event.target.id == 'leftImage') {
            objectsArray[leftImageIndex].clicks++;
        } else if (event.target.id == 'middelImage') {
            objectsArray[middelImageIndex].clicks++;
        } else if (event.target.id == 'rightImage') {
            objectsArray[rightImageIndex].clicks++;
        }
    } else { // Removing Event Listners
        leftImage.removeEventListener('click', clicks);
        middelImage.removeEventListener('click', clicks);
        rightImage.removeEventListener('click', clicks);

        let button = document.getElementById('resultButton');//creating Results Buttoun with Eventlistener
        button.addEventListener('click', veiwResults);
        function veiwResults(event) {
            for (let i = 0; i < objectsArray.length; i++) {
                let liElement = document.createElement('li');
                unorderdList.appendChild(liElement);
                liElement.textContent = `${objectsArray[i].productName} had ${objectsArray[i].clicks} votes, and was seen ${objectsArray[i].veiws} times.`;
                numberOfClicks.push(objectsArray[i].clicks);
                numberOfVeiws.push(objectsArray[i].veiws);
                ProductsNames.push(objectsArray[i].productName);
            }
            getChart();
            button.removeEventListener('click', veiwResults);// Remove the Event Listener of the Button to  only show the results one time.
        }
    }
    getThreeImages();// on each click Render new three Images
}
function getChart() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ProductsNames,
            datasets: [{
                label: '# of Votes',
                data: numberOfClicks,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 2
            }, {
                label: '# of Veiws',
                data: numberOfVeiws,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
