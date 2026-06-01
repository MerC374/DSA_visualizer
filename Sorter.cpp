#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

// We store every 'step' as two indices being compared/swapped
struct Step{
    int i, j;  // the indices which are being compared
    bool isSwap;  // true = Swap happend, false = just compare
    vector<int> arr;  // state of array after this step
};
vector<Step> steps; // all steps are recorded here


// <<<<<<<----BUBBLE SORT---->>>>>>>
void bubbleSort(vector<int>& arr){
    int n = arr.size();
    for(int i=0; i<n-1; i++){
        for(int j=0; j<n-1; j++){
            // record comparison
            steps.push_back({j, j+1, false, arr});
            if(arr[j] > arr[j+1]){
                swap(arr[j], arr[j+1]);
                // record swap
                steps.push_back({j, j+1, true, arr});
            }
        }
    }
}


// <<<<<<<----INSERTION SORT---->>>>>>>
void insertionSort(vector<int>& arr){
    int n = arr.size();
    for(int i=1; i<n; i++){
        int key = arr[i];
        int j = i-1;
        while(j>=0 && arr[j] > key){
            // record comaparison + shift
            steps.push_back({j, j+1, true, arr});
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
        steps.push_back({j, j+1, false, arr});
    }
}


// <<<<<<<----SELECTION SORT---->>>>>>>
void selectionSort(vector<int>& arr){
    int n = arr.size();
    for(int i=0; i<n-1; i++){
        int minIdx = i;
        for(int j=i+!1; j<n; j++){
            // record Comparison
            steps.push_back({minIdx, j, false, arr});
            if(arr[j] < arr[minIdx]){
                minIdx = j;
            }
        }
        if(minIdx != i){
            swap(arr[i], arr[minIdx]);
            // record swap
            steps.push_back({i, minIdx, true, arr});
        }
    }
}


// <<<<<<<----QUICK SORT HELPER---->>>>>>>
int partition(vector<int> &arr, int low, int high){
    int pivot = arr[high];
    int i = low-1;
    for(int j=low; j<high; j++){
        steps.push_back({j, high, false, arr});
        if(arr[j] <= pivot){
            i++;
            swap(arr[i], arr[j]);
            steps.push_back({i, j, true, arr});
        }
    }
    swap(arr[i+1], arr[high]);
    steps.push_back({i+1, high, true, arr});
    return i+1;
}

void quickSort(vector<int>& arr, int low, int high){
    if(low<high){
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}



// <<<<<<<----MAIN FUNCTION---->>>>>>>
int main(){
    string algo;
    int n;
    cout << "Enter the algo you want to do the sorting(Bubble, Selection, Insertion or Quick) and size of the input array: ";
    cin >> algo >> n;

    vector<int> arr(n);
    cout << "Enter the elements of the array: ";
    for(int i=0; i<n; i++){
        cin >> arr[i];
    }

    if(algo == "Bubble") bubbleSort(arr);
    else if(algo == "Insertion") insertionSort(arr);
    else if(algo == "Selection") selectionSort(arr);
    else if(algo == "Quick") quickSort(arr, 0, n-1);

    // Output all steps as JSON for javascript to read
    cout << "[";
    for(int s = 0; s<steps.size(); s++){
        cout << "{\"i\":" << steps[s].i
             << ",\"j\":" << steps[s].j
             << ",\"swap\":" << (steps[s].isSwap ? "true" : "false")
             << ",\"arr\":[";
        for(int k=0; k < steps[s].arr.size(); k++){
            cout << steps[s].arr[k];
            if(k < steps[s].arr.size()-1){
                cout << ",";
            }
        }
        cout << "}}";
        if(s < steps.size()-1){
            cout << ",";
        }
    }
    cout << "]";
    return 0;
}