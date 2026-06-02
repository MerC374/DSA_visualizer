// -------ALGORITHM INFO-----------------------------------
const algoInfo = {
    bubble: { name: "Bubble Sort", complexity: "O(n²)" },
    insertion: { name: "Insertion Sort", complexity: "O(n²)" },
    selection: { name: "Selection Sort", complexity: "O(n²)" },
    quick: { name: "Quick Sort", complexity: "O(n logn)" }
};

// -------STATE---------------------------------------------
let array = [];
let isSorting = false;

// -------GENERATE RANDOM ARRAY-----------------------------
function generateArray(size = 20){
    array = [];
    for(let i=0; i<size; i++){
        array.push(Math.floor(Math.random() * 280) + 20); // values 20-300
    }
    renderBars(array, [], []);
    document.getElementById('status').textContent = "Press Sort to start";
    document.getElementById('compCount').textContent = "0";
    document.getElementById('swapCount').textContent = "0";
}

// -------RENDER BARS---------------------------------------
function renderBars(arr, comparing = [], swapping = [], sorted = []){
    const container = document.getElementById('barsContainer');
    container.innerHTML = '';
    const maxVal = Math.max(...arr);

    arr.forEach((val, idx) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(val / maxVal) * 280}px`;

        // Apply colors based on state
        if(sorted.includes(idx)){
            bar.classList.add('sorted');
        }        
        else if(swapping.includes(idx)){
            bar.classList.add('swapping');
        }
        else if(comparing.includes(idx)){
            bar.classList.add('comparing');
        }

        // Show value on bar
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = val;
        bar.appendChild(label);

        container.appendChild(bar);
    });
}


// -------BUBBLE SORT STEP----------------------------------
function getBubbleSteps(arr){
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for(let i=0; i<n-1; i++){
        for(let j=0; j<n-i-1; j++){
            steps.push({arr: [...a], comparing: [j, j+1], swapping: [] });
            if(a[j] > a[j+1]){
                [a[j], a[j+1]] = [a[j+1], a[j]];
                steps.push({ arr: [...a], comparing: [], swapping: [j, j+1] });
            }
        }
    }
    steps.push({arr: [...a], comparing: [], swapping: [], done: true });
    return steps;
}


// -------INSERTION SORT STEPS--------------------------------
function getInsertionSteps(arr){
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for(let i=1; i<n; i++){
        let j = i;
        while(j>0 && a[j-1] > a[j]){
            steps.push({arr: [...a], comparing: [j-1, j], swapping: [] });
            [a[j-1], a[j]] = [a[j], a[j-1]];
            steps.push({ arr: [...a], comparing: [], swapping: [j-1, j]});
            j--;
        }
    }
    steps.push({arr: [...a], comparing: [], swapping: [], done: true});
    return steps;
}


// -------SELECTION SORT STEPS-------------------------------
function getSelectionSteps(arr){
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for(let i=0; i<n-1; i++){
        let minIdx = i;
        for(let j=i+1; j<n; j++){
            steps.push({arr: [...a], comparing: [minIdx, j], swapping: [] });
            if(a[j] < a[minIdx]){
                minIdx = j;
            }
        }
        if(minIdx !== i){
            [a[i], a[minIdx]] = [a[minIdx], a[i]];
            steps.push({arr: [...a], comparing: [],swapping: [i, minIdx] });
        }
    }
    steps.push({arr: [...a], comparing: [], swapping: [], done: true});
    return steps;
}


// -------QUICK SORT STEPS----------------------------------
function getQuickSteps(arr){
    const steps = [];
    const a = [...arr];

    function partition(low, high){
        const pivot = a[high];
        let i = low-1;
        for(let j=low; j<high; j++){
            steps.push({ arr: [...a], comparing: [j, high], swapping: [] });
            if(a[j] <= pivot){
                i++;
                [a[i], a[j]] = [a[j], a[i]];
                steps.push({ arr: [...a], comparing: [], swapping:[i, j] }); 
            }
        }
        [a[i+1], a[high]] = [a[high], a[i+1]];
        steps.push({ arr: [...a], comparing: [], swapping: [i+1, high] });
        return i+1;
    }

    function quickSort(low, high){
        if(low < high){
            const pi = partition(low, high);
            quickSort(low, pi-1);
            quickSort(pi+1, high);
        }
    }

    quickSort(0, a.length-1);
    steps.push({ arr: [...a], comparing: [], swapping: [], done: true });
    return steps;
}


// -------ANIMATE STEPS--------------------------------------
async function animateSteps(steps){
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices = [];

    for(let i=0; i<steps.length; i++){
        if(!isSorting) break; // stop if reset pressed

        const step = steps[i];

        // count stats
        if(step.comparing.length > 0){
            comparisons++;
        }
        if(step.swapping.length > 0){
            swaps++;
        }

        // update counters on page
        document.getElementById('compCount').textContent = comparisons;
        document.getElementById('swapCount').textContent = swaps;

        // If last step - mark all as sorted
        if(step.done){
            renderBars(step.arr, [], [], [...Array(step.arr.length).keys()]);
            document.getElementById('status').textContent =     `Done! ${comparisons} comparisons, ${swaps} swaps`;
            break; 
        }

        // render current step
        renderBars(step.arr, step.comparing, step.swapping, sortedIndices);

        // update status message
        if(step.comparing.length > 0){
            document.getElementById('status').textContent = `Comparing positions ${step.comparing[0]} and ${step.comparing[1]}`;
        }
        else if(step.swapping.length > 0){
            document.getElementById('status').textContent = `Swapping ${step.arr[step.swapping[0]]} and ${step.arr[step.swapping[1]]}`;
        }

        // wait based on speed silder
        const speed = document.getElementById('speedSlider').value;
        const delay = Math.floor(600 / speed); // faster slider = less delay
        await sleep(delay);
    }

    isSorting = false;
    document.getElementById('sortBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
}


// -------SLEEP HELPER---------------------------------------
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -------START SORT-----------------------------------------
function startSort(){
    if(isSorting) return;
    isSorting = true;

    document.getElementById('sortBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;

    const algo = document.getElementById('algoSelect').value;
    let steps = [];

    if(algo === 'bubble'){
        steps = getBubbleSteps(array);
    }
    if(algo === 'insertion'){
        steps = getInsertionSteps(array);
    }
    if(algo === 'selection'){
        steps = getSelectionSteps(array);
    }
    if(algo === 'quick'){
        steps = getQuickSteps(array);
    }

    animateSteps(steps);
}


// -------RESET ARRAY----------------------------------------
function resetArray(){
    isSorting = false;
    document.getElementById('sortBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    generateArray(20);
}


// -------UPDATE INFO BAR WHEN ALGO CHANGES--------------------
document.getElementById('algoSelect').addEventListener('change', function(){
    const info = algoInfo[this.value];
    document.getElementById('algoName').textContent = info.name;
    document.getElementById('complexity').textContent = info.complexity;
});


// -------START ON PAGE LOAD-----------------------------------
generateArray(15);