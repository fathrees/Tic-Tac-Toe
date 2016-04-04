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
    chain = ["0uu", "u0u", "uu0"],
    map = [];

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

function refresh(){
    for (var i = 0; i < countFields; i++){
        document.getElementById(i.toString()).innerHTML = "";
        map[i] = 0;
        step = 0;
    }
}

function putSign(field, sign) {
    map[field] = ((sign === userSign) ? "u" : "c");
    document.getElementById(field.toString()).innerHTML = sign;
}

function compStep(){
    if (!map[center]) {
        putSign(center, compSign);
        return ifFinish();
    }
    if (!map[corner[0]] && !map[corner[1]] && !map[corner[2]] && !map[corner[3]]) {
        putSign(corner[getRandom(0, 3)], compSign);
        return ifFinish();
    }
    if (chain.some(function(item) {
            return checkChain(map, item);
        }) ||
        chain.some(function(item) {
            return checkChain(turn(map), item, true);
        })){
        return ifFinish();
    }
}

function ifFinish() {
    if (++step >= countFields) {
        finish();
    }
    return true;
}

function finish(){
    document.getElementById("finish").innerHTML = result;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkChain(array, chain, turned) {
    var posChain = array.join("").indexOf(chain);
    if ((posChain > -1) && (notChain.indexOf(posChain) === -1)) {
        if(!turned) {
            putSign(posChain + chain.indexOf("0"), compSign);
        }else{
            array[posChain + chain.indexOf("0")] = "c";
            turn(turn(turn(array))).forEach(function(item, i, arr) {
                if (item) {
                    document.getElementById(i.toString()).innerHTML = ((item === "c") ? compSign : userSign);
                }
            });
        }
        return true;
    }
    return false;
}

function turn(array) {
    var matrix = [];
    for (var i = 0; i < size; i++) {
        matrix[i] = array.slice(i * size, i * size + size);
    }
    var turned = [];
    for (i = 0; i < size; i++) {
        turned[i] = [];
        for (var j = 0; j < size; j++) {
            turned[i][j] = matrix[size-j-1][i];
        }
    }
    return turned.reduce(function(flat, current) {return flat.concat(current);}, []);
}

function userZero() {
    refresh();
    userSign = zero;
    compSign = cross;
    compStep();
}