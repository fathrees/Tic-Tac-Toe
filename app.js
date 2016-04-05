var cross = "<img src='cross.png'>",
    zero = "<img src='zero.png'>",
    result = "Нічия!",
    userSign = cross,
    compSign = zero,
    size = 3,
    countFields = size * size,
    map = [],
    center = 4,
    corner = [0, 2, 6, 8],
    notChain = [1, 2, 4, 5],
    compPoint = "c",
    userPoint = "u",
    compChain = ["0cc", "c0c", "cc0"],
    userChain = ["0uu", "u0u", "uu0"],
    step = 0;

function userStep(field) {
    if (!step){
        refresh();
    }
    putSign(field, userSign);
    if (!ifFinish()) {
        compStep();
    }
}

function refresh(){
    for (var i = 0; i < countFields; i++){
        document.getElementById(i.toString()).innerHTML = "";
        map[i] = 0;
    }
    step = 0;
}

function putSign(field, sign) {
    map[field] = ((sign === userSign) ? userPoint : compPoint);
    document.getElementById(field.toString()).innerHTML = sign;
}

function ifFinish() {
    if (++step >= countFields) {
        document.getElementById("finish").innerHTML = result;
        return true;
    }
    return false;
}

function compStep(){
    if (step < 3) {
        if (!map[center]) {
            putSign(center, compSign);
            return step++;
        }
        if (corner.every(function (item) {
                return !map[item]
            })) {
            putSign(corner[getRandom(0, 3)], compSign);
            return step++;
        }
    }
    if (direct(compChain) || diagonal(compPoint)) {
        return ifFinish();
    }
    if (direct(userChain) || diagonal(userPoint)) {
        return ifFinish();
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function direct(chain) {
    if (chain.some(function (item) {
            return checkChain(map, item);
        }) ||
        chain.some(function (item) {
            var turnedMap = turn(map);
            return checkChain(turnedMap, item, true);
        })) {
        return true;
    }
    return false;
}

function checkChain(array, chain, turned) {
    var position = array.join("").indexOf(chain);
    if ((position > -1) && (notChain.indexOf(position) === -1)) {
        if(!turned) {
            putSign(position + chain.indexOf("0"), compSign);
            if (chain.indexOf(compPoint) > -1) {
                compWon(position);
            }
        }else{
            array[position + chain.indexOf("0")] = compPoint;
            map = turn(turn(turn(array)));
            map.forEach(function(item, i, arr) {
                if (item) {
                    document.getElementById(i.toString()).innerHTML = ((item === compPoint) ? compSign : userSign);
                }
            });
        }
        return true;
    }
    return false;
}

function compWon(position) {
    //for (var i = 0; i < size; i++) {
    //    document.getElementById((position + i).toString()).style.backgroundColor = "#00cc00";
    //}
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
            turned[i][j] = matrix[size - j - 1][i];
        }
    }
    return turned.reduce(function(flat, current) {return flat.concat(current);}, []);
}

function diagonal(point) {
    var opposite;
    if ((map[center] === point) && corner.some(function (item, i, arr) {
            opposite = arr.length - i - 1;
            return (map[item] === point && !map[arr[opposite]]);
        })) {
        putSign(corner[opposite], compSign);
        return true;
    }
    return false;
}

function userZero() {
    refresh();
    userSign = zero;
    compSign = cross;
    compStep();
}