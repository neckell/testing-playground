// function swap(items, leftIndex, rightIndex){
//     var temp = items[leftIndex];
//     items[leftIndex] = items[rightIndex];
//     items[rightIndex] = temp;
// }

// function partition(items, left, right) {
//     var pivot   = items[Math.floor((right + left) / 2)], //middle element
//         i       = left, //left pointer
//         j       = right; //right pointer
//     while (i <= j) {
//         while (items[i] < pivot) {
//             i++;
//         }
//         while (items[j] > pivot) {
//             j--;
//         }
//         if (i <= j) {
//             console.log(`array:  ${items}`);
//             console.log(`pivot: ${pivot}. swap:  (${items[i]}) and (${items[j]})`);
//             swap(items, i, j); //sawpping two elements
//             i++;
//             j--;
//         }
//     }
//     return i;
// }

// function quickSort(items, left, right) {
//     let index;
//     if (items.length > 1) {
//         index = partition(items, left, right); //index returned from partition
//         if (left < index - 1) { //more elements on the left side of the pivot
//             quickSort(items, left, index - 1);
//         }
//         if (index < right) { //more elements on the right side of the pivot
//             quickSort(items, index, right);
//         }
//     }
//     return items;
// }
// // first call to quick sort



// const N = 10;

// let arr = [];
// for(let i=0;i<N;i++){
//     arr.push(Math.floor((Math.random() * N)));
// }

// console.log(arr);
// var sortedArray = quickSort(arr, 0, arr.length - 1);
// console.log(sortedArray);

// Ejemplo usando async y await

// const datos = [
//     {
//         id: 1,
//         name: 'TCC',
//         year: 2008
//     },
//     {
//         id: 2,
//         name: 'Jurassic Park',
//         year: 2003
//     },
//     {
//         id: 3,
//         name: 'Harry Potter III',
//         year: 2011
//     }
// ];

// const getDatos = () => {
//     return new Promise( (resolve, reject) => {
//         if (datos.length === 0){
//             reject(new Error('No hay datos bro', 404));
//         }
//         setTimeout(() => {
//             resolve(datos);
//         }, 1500);
//     })
// }

// async function fetchData() {
//     try{
//         const datos = await getDatos();
//         console.log(datos);
//     }
//     catch (err){
//         console.log(err);
//     }
// }

// fetchData();


// Clousures: pseudo clases en js

const contador = (() => {
    let _contador = 0;

    const incrementar = () => {
        _contador++;
    }

    const decrementar = () => {
        _contador--;
    }

    const valor = () => {
        return _contador;
    }

    return {
        incrementar,
        decrementar,
        valor
    };
})();

contador.decrementar();
console.log(contador.valor());
contador.incrementar();
contador.incrementar();
contador.incrementar();
console.log(contador.valor());
contador.decrementar();
console.log(contador.valor());