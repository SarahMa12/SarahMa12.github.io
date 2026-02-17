var stats;

// Set margins
let margin = 80;
let chartWidth, chartHeight;

// variables
let weights = [];

function preload() {
    stats = loadTable("athlete_events.csv", "header");
}

function setup() {
    createCanvas(800, 500);
    background(255);
    chartWidth = width - (margin * 2);
    chartHeight = height - (margin * 2);

    for (let i = 0; i < stats.getRowCount(); i++) {
        let wStr = stats.getString(i, "Weight");
        let weight = Number(wStr);

        // skip NaN values
        if (!isNaN(weight) && wStr !== "NA") {
            weights.push(weight * 2.205); 
        }
    }
}

function draw() {
    background(255)
    stroke(200);

    // y axis
    line(margin, margin, margin, margin + chartHeight);
    // x axis
    line(margin, margin + chartHeight, margin + chartWidth, margin + chartHeight);

    // draw grid lines on y
    let numTicksY = 5;
    let startVal = 0;
    let step = 100;  
    let ySpacing = chartHeight / numTicksY;

    for (let i = 1; i <= numTicksY; i++) {
        let y = (margin + chartHeight) - (i * ySpacing);

        // draw grids
        stroke(220); 
        line(margin, y, margin + chartWidth, y);

        // draw labels
        noStroke();
        fill(100);
        textAlign(RIGHT, CENTER);
        
        let labelVal = startVal + (i * step);
        
        text(labelVal, margin - 10, y);
    }

    // y axis title
    push();
    fill(100);
    translate(20, height / 2); 
    rotate(-PI / 2);
    textAlign(CENTER);
    text("Weight (lb)", 0, 0);
    pop();

    // chart title
    push();
    fill(100);
    textStyle(BOLD);
    textAlign(CENTER);
    textSize(18);
    text("Distribution of Olympic Medal Athletes Weight", width / 2, margin / 2);
    pop();

    let centerX = margin + (chartWidth / 2);
    
    // initiate random
    randomSeed(1); 

    // draw the dots
    for (let i = 0; i < weights.length; i++) {
        // map weights to the correct pixel coordinate
        let yPos = map(weights[i], 0, 500, margin + chartHeight, margin);

        // randomly place points with the same position from -60 to 60 pixels
        let xJitter = centerX + random(-60, 60);

        // draw small transparent circles
        fill(76, 114, 176);
        stroke(76, 114, 176, 5); 
        strokeWeight(1);
        ellipse(xJitter, yPos, 4, 4);
    }
}