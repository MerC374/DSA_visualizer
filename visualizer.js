// -------ALGORITHM INFO---------------
const algoInfo = {
    bubble: { name: "Bubble Sort", complexity: "O(n²)" },
    insertion: { name: "Insertion Sort", complexity: "O(n²)" },
    selection: { name: "Selection Sort", complexity: "O(n²)" },
    quick: { name: "Quick Sort", complexity: "O(n logn)" }
};

// -------STATE-------------------------
let array = [];
let isSorting = false;

// -------GENERATE RANDOM ARRAY---------
function generateArray(size = 20){
    array = [];
    for(let i=0; i<size; i++){
        array.push(Math.floor(Math.random() * 280) + 20); // values 20-300
    }
    renderBars(array, [], []);
    document.getElementById('status').textContent = "Press Sort to start";
    document.getElementById('compCoount').textContent = "0";
    document.getElementById('swapCoount').textContent = "0";
}

// -------RENDER BARS-------------------
function renderBars(arr, comparing = [], swapping = [], sorted = []){
    const container = document.getElementById('barsConatiner');
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


// -------BUBBLE SORT STEP--------------
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


// -------INSERTION SORT STEPS------------
function getInsertionSteps(arr){
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for(let i=1; i<n; i++){
        let j = i;
        while(j>0 && a[j-1] > a[j]){
            steps.push({arr: [...a], comparing: [j-1, j], swapping: [] });
            [a[j-1], a[j]] = [a[j], a[j-1]];
            steps.push({ arr: [...a], comapring: [], swapping: [[j-1], j]});
            j--;
        }
    }
    steps.push({arr: [...a], comapring: [], swapping: [], done: true});
    return steps;
}


// -------SELECTION SORT STEPS-----------
function getsSelectionSteps(arr){
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for(let i=0; i<n-1; i++){
        let minIdx = i;
        for(let j=i+1; j<n; j++){
            steps.push({arr: [...a], comparing: [minIdx, j], swapping: [] });
            if(a[j] > a[minIdx]){
                minIdx = j;
            }
        }
        if(minIdx !== i){
            [s[i], a[minIdx]] = [a[minIdx], a[i]];
            steps.push({arr: [...a], comparing: [],swapping: [i, minIdx] });
        }
    }
    steps.push({arr: [...a], comapring: [], swapping: [], done: true});
    return steps;
}


// -------QUICK SORT STEPS--------------
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
    }
}