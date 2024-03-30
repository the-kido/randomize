(color) =>`.center { border: 3px solid ` + color + `; }`

const text = document.getElementById("text")
const button = document.getElementById("button");
const root = document.querySelector(':root');

onButtonPressed();
function onButtonPressed() {
    var r = Math.random()*200,
        g = Math.random()*200,
        b = Math.random()*200;
        
        var newBorderColor = "rgb(" + [r, g, b].join(", "); + ")"
        root.style.setProperty("--border-color", newBorderColor);
        
        var hsv = rgb2hsv(r, g, b)
        hsv.h = Math.round(hsv.h, 2) - 25;
        hsv.s = Math.round(hsv.s, 2) / 5+ "%";
        
        hsv.v = Math.max(100 - hsv.v, hsv.v) * 1.5;
        hsv.v = hsv.v > 100 ? "90%" : hsv.v + "%";
        
        var newBackgroundColor = "hsl(" + hsv.h + ", " + hsv.s + ", " + hsv.v + ")"
        root.style.setProperty("--background-color", newBackgroundColor);
        
        var rand = Math.random()
        text.innerHTML = rand <= 0.5 ? "←" : "→"
    }

    var div = document.getElementsByClassName("center")[0]

    const myObserver = new ResizeObserver(() => {
        console.log("hello " + document.body.scrollHeight)
        console.log("hello " + div.offsetHeight + " also")
        var height = parseInt( (document.body.scrollHeight - div.offsetHeight) / 2 );
        div.style.marginTop = height.toString() + "px";
    }).observe(document.body);


// stolen: https://stackoverflow.com/a/54070620
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };

    
}
