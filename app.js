var cross = "<img src='cross.png'>",
    zero = "<img src='zero.png'>",
    winMsg = "Комп'ютер переміг!",
    drawMsg = "Нічия!",
    userSign = cross,
    compSign = zero,
    size = 3,
    countFields = size * size,
    map = [],
    center = 4,
    corners = [0, 2, 6, 8],
    notChain = [1, 2, 4, 5],
    compPoint = "c",
    userPoint = "u",
    empty = 0,
    compChain = ["0cc", "c0c", "cc0"],
    userChain = ["0uu", "u0u", "uu0"],
    corner,
    step = 0;

function userStep(field) {
    if (!step){
        refresh();
    }
    putSign(field, userSign);
    if (!ifFinish(drawMsg)) {
        compStep(false);
    }
}

function refresh(){
    for (var i = 0; i < countFields; i++){
        map[i] = empty;
        document.getElementById(i.toString()).innerHTML = "";
    }
    step = 0;
}

function putSign(field, sign) {
    map[field] = ((sign === userSign) ? userPoint : compPoint);
    document.getElementById(field.toString()).innerHTML = sign;
}

function ifFinish(result) {
    if ((++step >= countFields) || (result === winMsg)) {
        document.getElementById("msg").innerHTML = result;
        return true;
    }
    return false;
}

function compStep(first){
    if (step < 3) {
        if (!map[center] && (!step && getRandom(0, 1) || step)) {
            putSign(center, compSign);
        } else if (step !== 2) {
            corner = getRandom(0, 3);
            putSign(corners[corner], compSign);
        } else if (map[center] === userPoint) {
            putSign(corners[corners.length - corner - 1], compSign);
        } else if (corners.some(function(item, i, arr) {
                if (item) {
                    corner = arr.length - i - 1;
                    return true;
                }
            })) {

        }
        return step++;
    }

    if (horizontal(compChain) || vertical(compPoint) || diagonal(compPoint)) {
        return ifFinish(winMsg);
    }
    if (horizontal(userChain) || vertical(userPoint) || diagonal(userPoint)) {
        return ifFinish(drawMsg);
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function horizontal(chain) {
    return chain.some(function(item) {
    var position = map.join("").indexOf(item);
    if ((position > -1) && (notChain.indexOf(position) === -1)) {
        putSign(position + item.indexOf(empty), compSign);
        //if (item.indexOf(compPoint) > -1) {
        //    compWon(position);
        //}
        return true;
    }});
}

//function compWon(position) {
//    for (var i = 0; i < size; i++) {
//        document.getElementById((position + i).toString()).style.backgroundColor = "#00cc00";
//    }
//}

function vertical(point) {
    for (var i = 0; i < 2 * size; i++) {
        if (map[i] === point) {
            if ((map[i + 2 * size] === point) && !map[i + size]) {
                putSign(i + size, compSign);
                return true;
            }
            if (map[i + size] === point) {
                if ((i < size) && !map[i + 2 * size]) {
                    putSign((i + 2 * size), compSign);
                    return true;
                } else if ((i >= size) && !map[i - size]) {
                    putSign((i - size), compSign);
                    return true;
                }
            }
        }
    }
    return false;
}

function diagonal(point) {
    var opposite;
    if ((map[center] === point) && corners.some(function (item, i, arr) {
            opposite = arr.length - i - 1;
            return ((map[item] === point) && !map[arr[opposite]]);
        })) {
        putSign(corners[opposite], compSign);
        return true;
    }
    return false;
}

function userZero() {
    refresh();
    userSign = zero;
    compSign = cross;
    compStep(true);
}