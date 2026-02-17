var stats;

// Set margins
let margin = 80;
let chartWidth, chartHeight;

// variables
let heights = [];
let minH, q1, median, q3, maxH;
let whiskerMin, whiskerMax;

function preload() {
    stats = loadTable("athlete_events.csv", "header");
}

function setup() {
    createCanvas(800, 500);
    background(255);
    chartWidth = width - (margin * 2);
    chartHeight = height - (margin * 2);

    for (let i = 0; i < stats.getRowCount(); i++) {
        let hStr = stats.getString(i, "Height");
        let height = Number(hStr);

        // Skip NaN vals
        if (!isNaN(height) && hStr !== "NA") {
            heights.push(height / 30.48);
        }
    }

    // sort the heights
    heights.sort((a, b) => a - b);

    if (heights.length > 0) {
        // 3. Calculate the Five-Number Summary
        minH = heights[0];
        q1 = heights[floor(heights.length * 0.25)];
        median = heights[floor(heights.length / 2)];
        q3 = heights[floor(heights.length * 0.75)];
        maxH = heights[heights.length - 1];

        // 4. Calculate IQR and Outlier Fences
        let iqr = q3 - q1;
        let lowerFence = q1 - (iqr * 1.5);
        let upperFence = q3 + (iqr * 1.5);

        // 5. Find Whisker Ends (Smallest/Largest values inside the fences)
        whiskerMin = q1; // Default starting points
        whiskerMax = q3;

        for (let h of heights) {
            if (h >= lowerFence) {
                whiskerMin = h; // First value that isn't a "bottom" outlier
                break;
            }
        }

        for (let i = heights.length - 1; i >= 0; i--) {
            if (heights[i] <= upperFence) {
                whiskerMax = heights[i]; // First value that isn't a "top" outlier
                break;
            }
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
    let numTicksY = 7;
    let startVal = 4.0;
    let step = 0.5;  
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
        
        text(labelVal.toFixed(1), margin - 10, y);
    }

    // y axis title
    push();
    fill(100);
    translate(20, height / 2); 
    rotate(-PI / 2);
    textAlign(CENTER);
    text("Height (ft)", 0, 0);
    pop();

    // chart title
    push();
    fill(100);
    textStyle(BOLD);
    textAlign(CENTER);
    textSize(18);
    text("Distribution of Olympic Medal Athletes Height", width / 2, margin / 2);
    pop();
    
    // calculate center and width of the box
    let centerX = margin + (chartWidth / 2);
    let boxWidth = 300; 

    // map data values to pixel coordinates
    let yQ1 = map(q1, 4.0, 7.5, margin + chartHeight, margin);
    let yMedian = map(median, 4.0, 7.5, margin + chartHeight, margin);
    let yQ3 = map(q3, 4.0, 7.5, margin + chartHeight, margin);
    let yWMin = map(whiskerMin, 4.0, 7.5, margin + chartHeight, margin);
    let yWMax = map(whiskerMax, 4.0, 7.5, margin + chartHeight, margin);

    // draw whiskers
    stroke(80);
    strokeWeight(1);
    line(centerX, yWMin, centerX, yWMax); // vertical line connecting the box to the whiskers
    line(centerX - 50, yWMin, centerX + 50, yWMin); // bottom cap
    line(centerX - 50, yWMax, centerX + 50, yWMax); // top cap

    // draw box
    fill(76, 114, 176);
    stroke(50);
    rect(centerX - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

    // draw median line
    stroke(50);
    strokeWeight(1);
    line(centerX - boxWidth / 2, yMedian, centerX + boxWidth / 2, yMedian);

    // plot outliers
    noFill();
    stroke(80);
    strokeWeight(1);
    for (let h of heights) {
        // If the height is outside our whisker range, it's an outlier dot
        if (h < whiskerMin || h > whiskerMax) {
            let yOutlier = map(h, 4.0, 7.5, margin + chartHeight, margin);
            ellipse(centerX, yOutlier, 6, 6);
        }
    }
}