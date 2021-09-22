function derive(func, h, x) {
    /* Tråkig version med bestämd funktion
        return (Math.pow(2,x+h)-Math.pow(2,x))/h
    */
    let parser = math.parser()
    parser.set("x", x)
    parser.set("h", h)
    parser.evaluate("f(x) = " + func)
    return parser.evaluate("(f(x+h)-f(x))/h")
}

document.getElementById("deriveButton").addEventListener("click", evt => {
    let rightResults = []
    let leftResults = []

    let funcInput = document.getElementById("funcInput")
    let xInput = document.getElementById("xInput")

    let func = funcInput.value ? funcInput.value : "2^x"
    let x = xInput.value ? xInput.value : "3"

    let count = 0;
    for (i = 1; i >= 1e-10; i /= 10) {
        rightResults[count] = [i, derive(func, i, x)]
        leftResults[count] = [i, derive(func, -i, x)]
        count++
    }

    let genTable = ""
    for (let i = 0; i < rightResults.length; i++) {
        genTable += `<tr><td>${(+(rightResults[i][0].toPrecision(1))).toExponential()}</td><td>${rightResults[i][1]}</td><td>${leftResults[i][1]}</td></tr>`
    }

    let tableBody = document.getElementById("derivTable").getElementsByTagName("tbody")[0]
    tableBody.innerHTML = `<tr><th>|h|</th><th>f'(x)+</th><th>f'(x)-</th></tr>`
    tableBody.innerHTML += genTable

    let leftDeriv = leftResults[leftResults.length - 1][1]
    let rightDeriv = rightResults[rightResults.length - 1][1]
    let Deriv = leftDeriv === rightDeriv ? leftDeriv : "Ej deriverbar"

    let leftDerivEl = document.getElementById("leftderiv")
    let rightDerivEl = document.getElementById("rightderiv")
    let derivEl = document.getElementById("deriv")

    leftDerivEl.innerText = isNaN(Number(Deriv)) ? leftDeriv : "Inte tillämpbar"
    rightDerivEl.innerText = isNaN(Number(Deriv)) ? rightDeriv : "Inte tillämpbar"
    derivEl.innerText = Deriv
})