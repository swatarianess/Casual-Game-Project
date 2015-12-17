/**
 * Created by MB on 06/12/2015.
 */
//MB, tenth draft
function convertEq(num1, num2, sign, ans) {
    if (num1 === undefined || num2 === undefined || sign === undefined) {
        num1 = 2;
        num2 = 3;
        sign = 0.5;
    }

    var newNum1 = Math.floor(num1);
    var newNum2 = Math.floor(num2);
    var newSign = "";

    if (typeof ans === "string") {
        if (sign < 1) {
            newSign = "+";
        } else if (sign < 2) {
            newSign = "-";
        } else if (sign < 2.5) {
            newSign = "*";
        } else {
            newSign = "/";
        }
    } else {
        if (sign < 1) {
            newSign = "+";
            newNum2 = ans - newNum1;
        } else if (sign < 2) {
            newSign = "-";
            newNum2 = newNum1 - ans;
        } else if (sign < 2.5) {
            newSign = "*";
            newNum2 = ans / newNum1;
        } else {
            newSign = "/";
            newNum2 = NewNum1 / ans;
        }
    }

    return newNum1 + " " + newSign + " " + newNum2;
}

function checkEq(eq) {
    if (eq === undefined) {
        eq = [3, "-", 2];
    }

    if (eq[2] % 1 !== 0) {
        return false;
    } else {
        var num1 = parseInt(eq[0]);
        var num2 = parseInt(eq[2]);
        var sign = eq[1];

        switch (sign) {
            case "-":
                if (num1 - num2 < 0) {
                    return false;
                }
            case "/":
                if (num1 % num2 !== 0 || num2 > 12) {
                    return false;
                }
            case "*":
                if (num1 > 12 || num2 > 12) {
                    return false;
                }
            default:
                return true;
        }
    }
}

function genEq(diff, lvl, ans) {
    if (diff === undefined || lvl === undefined) {
        diff = 1;
        lvl = 1;
    }

    var splitEq = [];
    var eq = "";
    var sign = Math.random(); //Rebalance later.
    var goodEq = false;

    if (diff === 3) {
        sign = sign * 3;
    } else {
        sign = sign * 2;
    }

    do {
        var num1 = Math.random() * 10 * diff * Math.ceil(lvl / 10); //Rebalance later.
        var num2 = Math.random() * 10 * diff * Math.ceil(lvl / 10); //Rebalance later.
        eq = convertEq(num1, num2, sign, ans || "nope");
        splitEq = eq.split(" ");
        goodEq = checkEq(splitEq);
    } while (!goodEq);

    eq = eq + " " + eval(eq);
    document.getElementById("result").innerHTML = eq;
    return eq;
}