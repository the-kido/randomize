const text = document.getElementById("text")
const button = document.getElementById("button");
const root = document.querySelector(':root');
const mainDiv = document.getElementsByClassName("center")[0]


const properties = {
    borderColor: "--border-color",
    backgroundColor: "--background-color",
    direction: "--direction",
    previousDirection: "--previous-direction", 
    transitionTime: "--transition-time"
}

// Averaging the colours allows for a more natural feel
const averageBias = 0.5;
const animationTime = parseFloat(getComputedStyle(root).getPropertyValue(properties.transitionTime).replace("s", "")) * 1000;
// Invoke right as website is opened.
onButtonPressed();

function onButtonPressed() {
    // Debounce
    if (!inputAcceptable()) return;

    var r = Math.random() * 130 + 60,
        g = Math.random() * 130 + 60,
        b = Math.random() * 130 + 60;

    updateBorderColor(r, g, b);
    updateBackgroundColor(r, g, b);
    flipArrow();
}

var debounce = true;
function inputAcceptable() {
    if (debounce === true) return false;

    debounce = true;
    setTimeout(
        () => {
            debounce = false;    
        }, 
        animationTime
    );

    return true;
}

function updateBorderColor(r, g, b) {
    let complementBias = 1 - averageBias
    let avg = (r + g + b) / 3
    
    r = r * complementBias + avg * averageBias
    g = g * complementBias + avg * averageBias
    b = b * complementBias + avg * averageBias
    
    var newBorderColor = "rgb(" + [r, g, b].join(", ") + ")"
    root.style.setProperty(properties.borderColor, newBorderColor);
}

function mod(value, mod) {
    return (value % mod + mod) % mod;
}

function updateBackgroundColor(r, g, b) {
    var hsv = rgb2hsv(r, g, b)
    
    // Fix up hue, saturation, and value to make it a good background color
    hsv.h = mod((Math.round(hsv.h, 2) - 120), 360);
    hsv.s = Math.round(hsv.s, 2) / 2 + "%";
    hsv.v = Math.max(100 - hsv.v, hsv.v) * 1.5;
    hsv.v = hsv.v > 100 ? "90%" : hsv.v + "%";
    
    var newBackgroundColor = "hsl(" + hsv.h + ", " + hsv.s + ", " + hsv.v + ")"
    root.style.setProperty(properties.backgroundColor, newBackgroundColor);
}

function flipArrow() {
    // Set the previous direction
    root.style.setProperty(
        properties.previousDirection,     
        getComputedStyle(root).getPropertyValue(properties.direction)
    );
    // Update new direction for CSS animation to use.
    root.style.setProperty(properties.direction, Math.random() <= 0.5 ? 1 : -1);

    // Play the wobble animation and delete it after it is done..
    text.classList.add("wobble")
    setTimeout(
        () => text.classList.remove('wobble'), 
        animationTime
    );
}

function updateTMP() {
    mainDiv.style.marginTop = 0;
    var height = parseInt((document.body.scrollHeight - mainDiv.offsetHeight) / 2);
    mainDiv.style.marginTop = height.toString() + "px";
}

const myObserver = new ResizeObserver(updateTMP).observe(mainDiv);

// Stolen: https://stackoverflow.com/a/8023734. Tyvm for letting me not learn this conversion nonsense
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, hue, saturation, value, diff, diffc, percentRoundFn;
    
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    value = Math.max(rabs, gabs, babs),
    diff = value - Math.min(rabs, gabs, babs);
    diffc = c => (value - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        hue = saturation = 0;
    } else {
        saturation = diff / value;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === value) {
            hue = bb - gg;
        } else if (gabs === value) {
            hue = (1 / 3) + rr - bb;
        } else if (babs === value) {
            hue = (2 / 3) + gg - rr;
        }
        if (hue < 0) {
            hue += 1;
        } else if (hue > 1) {
            hue -= 1;
        }
    }
    return {
        h: Math.round(hue * 360),
        s: percentRoundFn(saturation * 100),
        v: percentRoundFn(value * 100)
    };
}
