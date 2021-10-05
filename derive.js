const origTableBody = document.getElementById("derivTable").getElementsByTagName("tbody")[0].innerHTML
let calc = Desmos.GraphingCalculator(document.getElementById("calculator"), {
    expressionsCollapsed: true,
    border: false,
    pointsOfInterest: false
})

function derive(func, h, x) {
    /* Tråkig version med bestämd funktion
        return (Math.pow(2,x+h)-Math.pow(2,x))/h
    */
    let parser = math.parser()
    parser.set("x", math.bignumber(x))
    parser.set("h", math.bignumber(h))
    parser.evaluate("f(x) = " + func)
    return parser.evaluate("(f(x+h)-f(x))/h")
}

document.getElementById("deriveButton").addEventListener("click", evt => {
    let precisionInput = document.getElementById("precisionInput")
    let precision = Math.round(precisionInput.value ? precisionInput.value : precisionInput.placeholder)

    math.config({
        number: 'BigNumber',
        precision: precision
    })

    let rightResults = []
    let leftResults = []

    let funcInput = document.getElementById("funcInput")
    let xInput = document.getElementById("xInput")

    let func = funcInput.value ? funcInput.value : funcInput.placeholder
    let x = xInput.value ? xInput.value : xInput.placeholder

    let count = 0;
    for (let i = 1; i >= +`1e-${precision-10}`; i /= 10) {
        rightResults[count] = [i, derive(func, i, x)]
        leftResults[count] = [i, derive(func, -i, x)]
        count++
    }

    let genTable = ""
    for (let i = 0; i < rightResults.length; i++) {
        genTable += `<tr><td>${(+(rightResults[i][0].toPrecision(1))).toExponential()}</td><td>${rightResults[i][1]}</td><td>${leftResults[i][1]}</td></tr>`
    }

    let tableBody = document.getElementById("derivTable").getElementsByTagName("tbody")[0]
    tableBody.innerHTML = origTableBody
    tableBody.innerHTML += genTable

    let leftDeriv = leftResults[leftResults.length - 1][1]
    let rightDeriv = rightResults[rightResults.length - 1][1]
    let Deriv = leftDeriv.equals(rightDeriv) ? leftDeriv : "Ej deriverbar"

    let leftDerivEl = document.getElementById("leftderiv")
    let rightDerivEl = document.getElementById("rightderiv")
    let derivEl = document.getElementById("deriv")

    leftDerivEl.innerText = isNaN(Number(Deriv)) ? leftDeriv : "Inte tillämpbar"
    rightDerivEl.innerText = isNaN(Number(Deriv)) ? rightDeriv : "Inte tillämpbar"
    derivEl.innerText = Deriv

    // Desmos
    calc.setBlank()

    let funcTex = "f(x)=" + math.parse(func).toTex().replaceAll("~","")
    console.log(funcTex)
    calc.setExpression({ id: 'function', latex: funcTex , color: Desmos.Colors.BLUE});
    if(!isNaN(Number(Deriv))){
        calc.setExpression({ id: 'tangent', latex: `y=\\left(${Deriv}\\right)\\left(x-${x}\\right)+f\\left(${x}\\right)`, color: Desmos.Colors.ORANGE})
        calc.setExpression({ id: 'tangentPoint', latex: `\\left(${x},f\\left(${x}\\right)\\right)`, color: Desmos.Colors.RED, pointStyle: Desmos.Styles.CROSS})
    }
})