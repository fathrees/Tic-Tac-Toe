var cross = "<img src='cross.png'>",
    zero = "<img src='zero.png'>",
    result = "Гру завершено!",
    userSign = cross,
    compSign = zero,
    size = 3,
    countFields = size * size,
    step = 0,
    center = 4,
    corner = [0, 2, 6, 8],
    notChain = [1, 2, 4, 5],
    map = [];

function userZero() {
    refresh();
    userSign = zero;
    compSign = cross;
    compStep();
}

function putSign(field, sign) {
    map[field] = ((sign === userSign) ? "u" : "c");
    document.getElementById(field.toString()).innerHTML = sign;
}

function userStep(field) {
    if (!step){
        refresh();
    }
    putSign(field, userSign);
    if (++step <= countFields) {
        compStep();
    }else{
        finish();
    }
}

function compStep(){
    if (!map[center]) {
        putSign(center, compSign);
        return ifFinish();
    }
    if (!map[corner[0]] && !map[corner[1]] && !map[corner[2]] && !map[corner[3]]) {
        var random = getRandom(0, 3);
        putSign(corner[random], compSign);
        return ifFinish();
    }
    var rowChain = checkChain(map, "uu0");
    if ((rowChain > -1) && (notChain.indexOf(rowChain) === -1)) {
        putSign(rowChain + 2, compSign);
        return ifFinish();
    }
    rowChain = checkChain(map, "0uu");
    if ((rowChain > -1) && (notChain.indexOf(rowChain) === -1)) {
        putSign(rowChain, compSign);
        return ifFinish();
    }
    rowChain = checkChain(map, "u0u");
    if ((rowChain > -1) && (notChain.indexOf(rowChain) === -1)) {
        putSign(rowChain + 1, compSign);
        return ifFinish();
    }
    //rowChain = checkChain(map, "0uu");
    //if ((rowChain > -1) && (notChain.indexOf(rowChain) === -1)) {
    //    putSign(rowChain, compSign);
    //    return ifFinish();
    //}
}

function refresh(){
    for (var i = 0; i < countFields; i++){
        document.getElementById(i.toString()).innerHTML = "";
        map[i] = 0;
    }
}

function finish(){
    document.getElementById("finish").innerHTML = result;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ifFinish() {
    if (++step >= countFields) {
        finish();
        return true;
    }
}

function turn(array) {
    var matrix = [],
        turned = [],
        newArr = [];
    for (var i = 0; i < size; i++) {
        matrix[i] = array.slice(i * size, size);
    }
    for (i = 0; i < size; i++) {
        turned[i] = [];
        for (var j = 0; j < size; j++) {
            turned[i][j] = matrix[j][size - i];
        }
    }
    return turned.reduce(function(flat, current) {return flat.concat(current);}, []);
}

function checkChain(array, chain) {
    return array.join("").indexOf(chain);
}