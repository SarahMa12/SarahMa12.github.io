var stats;
var cities = ["Honolulu", "Juneau", "Kansas City", "Miami", "New York", "Phoenix", "San Francisco", "Seattle"];
var dataGrid = [];
var cellSize = 50;

function preload() {
    // Load table with header as per Reading Example 12-3
    stats = loadTable("weather.csv", "header");
}

function setup() {
    createCanvas(850, 500);

    // Initialize 2D array column with 0s
    for (var c = 0; c < cities.length; c++) {
        dataGrid[c] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    // Aggregate SUM of Precipitation
    for (var i = 0; i < stats.getRowCount(); i++) {
        var rowCity = stats.get(i, "Station.City").trim();
        var cityIndex = cities.indexOf(rowCity);

        if (cityIndex !== -1) {
            var month = stats.getNum(i, "Date.Month") - 1;
            var rain = stats.getNum(i, "Data.Precipitation");
            dataGrid[cityIndex][month] += rain;
        }
    }
}

function draw() {
    background(245);
    var marginL = 120; 
    var marginT = 60; 

    fill(0);
    textSize(14);
    textAlign(CENTER);
    text("Month", marginL + width / 2 - 100, marginT - 35);

    // Nested Loop to display the grid
    for (var i = 0; i < cities.length; i++) {
        // City Labels on the left
        fill(0);
        textSize(12);
        textAlign(RIGHT, CENTER);
        text(cities[i], marginL - 10, marginT + (i * cellSize) + cellSize / 2);

        // SOURCE: https://editor.p5js.org/greggelong/sketches/tZ6MvMLUa
        for (var j = 0; j < 12; j++) {
            var v = dataGrid[i][j];
            
            // Convert aggregated value from data grid to a color
            var colorValue = map(v, 0, 30, 0, 255);

            // Convert the value to a color val rgb
            var c = color(colorValue, 255 - colorValue, 255 - colorValue);

            var x = marginL + j * cellSize;
            var y = marginT + i * cellSize;

            fill(c);
            noStroke();
            rect(x, y, cellSize, cellSize);

            // Month labels 
            if (i === 0) {
                fill(0);
                textAlign(CENTER);
                text(j + 1, x + cellSize / 2, marginT - 10);
            }
        }
    }
}