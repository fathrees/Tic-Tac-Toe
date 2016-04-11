var cross = "<img src='cross.png'>",
    zero = "<img src='zero.png'>",
    winMsg = "переміг комп'ютер",
    drawMsg = "нічия",
    turnMsg = "ваш хід",
    userSign = cross,
    compSign = zero,
    size = 3,
    countFields = size * size,
    map = [],
    center = 4,
    corners = [0, 2, 6, 8],
    middles = [1, 3, 5, 7],
    compPoint = "c",
    userPoint = "u",
    empty = 0,
    compChain = ["0cc", "c0c", "cc0"],
    userChain = ["0uu", "u0u", "uu0"],
    emptyChain,
    notChain = [1, 2, 4, 5],
    memorized,
    step = 0,
    finish = false;

function userCross() {
    refresh();
    userSign = cross;
    compSign = zero;
}

function userZero() {
    refresh();
    userSign = zero;
    compSign = cross;
    compStep();
}

function userStep(field) {
    if (!step){
        refresh();
    }
    if (!map[field] && !finish) {
        putSign(field, userSign);
        if(!ifFinish(drawMsg)) {
            compStep();
        }
    }
}

function refresh(){
    for (var i = 0; i < countFields; i++){
        map[i] = empty;
        document.getElementById(i.toString()).innerHTML = "";
        document.getElementById(i.toString()).style.backgroundColor = "#fff";
    }
    step = 0;
    finish = false;
    document.getElementById("msg").innerHTML = turnMsg;
}

function putSign(field, sign) {
    map[field] = ((sign === userSign) ? userPoint : compPoint);
    document.getElementById(field.toString()).innerHTML = sign;
}

function ifFinish(result) {
    if ((++step >= countFields) || (result === winMsg)) {
        document.getElementById("msg").innerHTML = result;
        finish = true;
    } else {
        finish = false;
    }
    return finish;
}

function compStep(){
    if (step < 3) {
        if (!map[center] && (!step && getRandom(0, 1) || step)) {
            putSign(center, compSign);
        } else if (step !== 2) {
            memorized = getRandom(0, 3);
            putSign(corners[memorized], compSign);
        } else if (map[center] === userPoint) {
            putSign(corners[corners.length - memorized - 1], compSign);
        } else if (corners.some(function(item, i, arr) {
                    memorized = arr.length - i - 1;
                    return map[item];
            })) {
            putSign(corners[memorized], compSign);
        } else {
            putSign(corners[getRandom(0, 3)], compSign);
        }
        return step++;
    }
    if (step === 3) {
        if (!corners.some(function(item) {
                return map[item];
            })) {
            if (middles.some(function (item, i) {
                    memorized = i;
                    return map[item];
                })) {
                var freeCorners = corners.slice();
                if (map[middles[middles.length - memorized - 1]] === userPoint) {
                    putSign(corners[getRandom(0, 3)], compSign);
                } else {
                    if (map[middles[memorized + 1]] === userPoint) {
                        memorized ? freeCorners.shift() : freeCorners.pop();
                    } else {
                        memorized ? freeCorners.splice(1, 1) : freeCorners.splice(2, 1);
                    }
                    putSign(freeCorners[getRandom(0, 2)], compSign);
                }
            }
            return step++;
        } else if (horizontal(userChain) || vertical(userPoint, empty) || diagonal(userPoint)) {
            return step++;
        } else if ((map[center] === compPoint) && (!middles.some(function(item) {
                return map[item];
            }))) {
            putSign(middles[getRandom(0, 3)], compSign);
            return step++;
        } else {
            if (corners.some(function(item, i, arr) {
                    memorized = i;
                    return map[item];
            })) {
                freeCorners = [];
                memorized ? freeCorners.push(corners[0], corners[3]) : freeCorners.push(corners[1], corners[2]);
                putSign(freeCorners[getRandom(0, 1)], compSign);
                return step++;
            }
        }
    }
    if (horizontal(compChain) || vertical(compPoint, empty) || diagonal(compPoint)) {
        return ifFinish(winMsg);
    }
    if (horizontal(userChain) || vertical(userPoint, empty) || diagonal(userPoint)) {
        return ifFinish(drawMsg);
    }
    emptyChain = (step === 4) ? ["00c", "c00"] : ["00c", "c00", "0c0"];
    if (horizontal(emptyChain) || vertical(empty, compPoint) || diagonal(compPoint, empty)) {
        return step++;
    }
    putSign(map.indexOf(empty), compSign);
    return ifFinish(drawMsg);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function horizontal(chain) {
    return chain.some(function(item) {
        var mapStr = map.join(""),
            position = mapStr.indexOf(item);
        if (notChain.indexOf(position) > -1) {
            position = mapStr.lastIndexOf(item);
        }
        if ((position > -1) && (notChain.indexOf(position) === -1)) {
            if (chain === emptyChain && getRandom(0, 1)) {
                putSign(position + item.lastIndexOf(empty), compSign);
            } else {
                putSign(position + item.indexOf(empty), compSign);
            }
            if (chain === compChain) {
                compWon(position, position + 1, position + 2);
            }
            return true;
    }});
}

function compWon(pos1, pos2, pos3) {
    document.getElementById(pos1.toString()).style.backgroundColor = "#5cd65c";
    document.getElementById(pos2.toString()).style.backgroundColor = "#5cd65c";
    document.getElementById(pos3.toString()).style.backgroundColor = "#5cd65c";
}

function vertical(point, other) {
    for (var i = 0; i < 2 * size; i++) {
        if (map[i] === point) {
            if ((map[i + 2 * size] === point) && (map[i + size] === other)) {
                if (point) {
                    putSign(i + size, compSign);
                    if (point === compPoint) {
                        compWon(i, i + 2 * size, i + size);
                    }
                } else {
                    getRandom(0, 1) ? putSign(i, compSign) : putSign(i + 2 * size, compSign);
                }
                return true;
            }
            if (map[i + size] === point) {
                if ((i < size) && (map[i + 2 * size] === other)) {
                    if (point) {
                        putSign(i + 2 * size, compSign);
                        if (point === compPoint) {
                            compWon(i, (i + 2 * size), (i + size));
                        }
                    } else {
                        getRandom(0, 1) ? putSign(i, compSign) : putSign(i + size, compSign);
                    }
                    return true;
                } else if ((i >= size) && (map[i - size] === other)) {
                    if (point){
                        putSign(i - size, compSign);
                        if (point === compPoint) {
                            compWon(i, i + size, i - size);
                        }
                    } else {
                        getRandom(0, 1) ? putSign(i, compSign) : putSign(i + size, compSign);
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

function diagonal(point, other) {
    var position, opposite;
    if (other === undefined) {
        other = point;
    }
    if ((map[center] === point) && corners.some(function (item, i, arr) {
            position = i;
            opposite = arr.length - i - 1;
            return ((map[item] === other) && !map[arr[opposite]]);
        })) {
        (other || getRandom(0, 1)) ? putSign(corners[opposite], compSign) : putSign(corners[position], compSign);
        if (point === compPoint && other === point) {
            compWon(corners[opposite], corners[position], center);
        }
        return true;
    }
    return false;
}
