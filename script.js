
const visualizer = document.getElementById('visualizer');
const generateBtn = document.getElementById('generateBtn');
const startSortButton = document.getElementById('sortBtn');
const resetButton = document.getElementById('reset');
const generateInput = document.getElementById('generate');
const swapElement = document.getElementById('swap');
const speedRange = document.getElementById('speedInput');
const random = document.getElementById('random');
const ascending = document.getElementById('ascending');
const descending = document.getElementById('descending');
const selector=document.getElementById('selector');
const time=document.getElementById('timeTaken');
const cell=document.getElementById('cell');
const bar=document.getElementById('bar');

let delay = getDelay()
let swapCount = 0;

// Function to generate an array of random heights for bars
function generateRandomArray(length, maxHeight) {
    const array = [];
    for (let i = 0; i < length; i++) {
        array.push(Math.floor(Math.random() * maxHeight) + 1);
    }
    return array;
}

//function which resolve after milliseconds using setTimeout 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//function to show generated array in input on ui
function inputArray(array) {
    generateInput.value = array.join(', ');
}

//function to show swap count on ui
function updateSwapCount() {
    swapElement.textContent = "Swaps: " + swapCount;
}

//function to show sorted array on ui
function showResult(array) {
    const result = document.getElementById('result');
    result.textContent = 'Sorted Array: ' + array.join(', ');
    result.style.fontWeight='bold'
}

//function to remove sorted array from ui
function removeResult() {
    const result = document.getElementById('result');
    result.textContent = ''; // Clear the result
}

//function to get delay
function getDelay() {
    const speed = parseInt(speedRange.value);
    return 1000 - speed * 7;
}

//function to update delay
function updateDelay(newDelay) {
    delay = newDelay;
}

//function to sort the generated array
function sortArray(array, sortOrder) {
    if (sortOrder === 'ascending') {
        return array.slice().sort((a, b) => a - b);
    } else if (sortOrder === 'descending') {
        return array.slice().sort((a, b) => b - a);
    }
    else if (sortOrder === 'random') {
        return array.slice().sort(() => Math.random() - 0.5);
    }
}


let isVisualization=true;

// Function to visualize the array as cell form
function visualizeArrayCell(array, swappedIndices,sortedIndex) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    array.forEach((height, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';

        
        if (swappedIndices && (swappedIndices[0] === index || swappedIndices[1] === index)) {
            cell.style.backgroundColor = 'red'; // Change the color for swapped cells
            swapCount++;
            updateSwapCount();
        }else if (index <= sortedIndex) {
            cell.style.backgroundColor = 'green'; // Change the color for elements in their final sorted position
        }
        
        cell.textContent = height;
        cell.style.border='2px solid black';
        cell.style.padding='15px';
        cell.style.borderRadius='5px';
        visualizer.appendChild(cell);
    });
}

//function to visualize the array as bar form
function visualizeArrayBar(array, swappedIndices, sortedIndex){
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    array.forEach((height, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = height + 'px';

        if (swappedIndices && (swappedIndices[0] === index || swappedIndices[1] === index)) {
            bar.style.backgroundColor = 'red'; // Change the color for swapped bars
            swapCount++;
            updateSwapCount();
        }else if (index <= sortedIndex) {
            bar.style.backgroundColor = 'green'; // Change the color for elements in their final sorted position
        }

        const number = document.createElement('span');
        number.textContent = height;
        barContainer.appendChild(bar);
        barContainer.appendChild(number);
        visualizer.appendChild(barContainer);
    });
}

// Bubble Sort algorithm
async function bubbleSort(array) {
    const len = array.length;
    let swapped;
    swapCount = 0;
   const startTime = new Date().getTime();
    for (let i = 0; i < len - 1; i++) {
        swapped = false;

        for (let j = 0; j < len - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                // Swap elements
                const temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                // Visualize the swap and change bar colors
                if(isVisualization){
                    visualizeArrayCell(array.slice(), [j, j + 1])
                }
                else{
                    visualizeArrayBar(array.slice(), [j, j + 1]);
                }
                await sleep(delay); 
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }

   const endTime = new Date().getTime();

   const timeTaken = Math.floor((endTime - startTime)/1000);
    time.textContent = "Time: " + timeTaken +" second";
    
    updateSwapCount();
    showResult(array);
    // debugger
    if(isVisualization){
        visualizeArrayCell(array, null, array.length - 1)
    }
    else{
        visualizeArrayBar(array, null, array.length - 1);
    }
}

// generate Random array on click
generateBtn.addEventListener('click', () => {
    array = generateRandomArray(10, 200);
    const sortedArray=sortArray(array, selector.value);
    inputArray(sortedArray);
    if(isVisualization){
        visualizeArrayCell(sortedArray)
    }
    else{
        visualizeArrayBar(sortedArray);
    }
    swapCount = 0
    updateSwapCount();
    removeResult();
    startSortButton.disabled= false;
    time.textContent = "Time: " + 0;
});

//show element in cell form on click 
cell.addEventListener('click',()=>{
    const sortedArray=sortArray(array, selector.value);
    isVisualization=true;
    visualizeArrayCell(sortedArray);
})

//show element in bar form on click 
bar.addEventListener('click',()=>{
    const sortedArray=sortArray(array, selector.value);
    isVisualization=false;
    visualizeArrayBar(sortedArray);
})

//maintain the speed of sorting
speedRange.addEventListener('input', () => {
    delay = getDelay();
    updateDelay(delay);
})

//sort the generated array on click
startSortButton.addEventListener('click', async () => {
    await bubbleSort(array.slice());
    startSortButton.disabled= true;
});

//reset the sorted array
resetButton.addEventListener('click', () => {
    const selectOrder=selector.value;
    const sortedArray=sortArray(array, selectOrder);
    inputArray(sortedArray);
    swapCount = 0
    updateSwapCount();
    removeResult();
    if(isVisualization){
        visualizeArrayCell(sortedArray)
    }
    else{
        visualizeArrayBar(sortedArray);
    }
    startSortButton.disabled= false;
    time.textContent = "Time: " + 0;
})

//select the order of sorting
selector.addEventListener('change', ()=>{
    const selectOrder=selector.value;
    const sortedArray=sortArray(array, selectOrder);
    inputArray(sortedArray);
    if(isVisualization){
        visualizeArrayCell(sortedArray)
    }
    else{
        visualizeArrayBar(sortedArray);
    }
    removeResult();
    swapCount = 0
    updateSwapCount();
    startSortButton.disabled= false;
    time.textContent = "Time: " + 0;
})