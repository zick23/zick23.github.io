
// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 100, bottom: 100, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(8);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(8);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.h); });

// Adds the svg canvas
var svg = d3.select("#space3")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


timeArr = [];
arrData = [];
data = [];

// Constant and initial parameters
c = 2.99792458*Math.pow(10,10);
G  = 6.67259*Math.pow(10,-8);
m_sun = 1.989*Math.pow(10,33);
t_inter = 0.001;
time_points = 1000;
pc = 3.1*Math.pow(10,18);

f_i = freq_pass; // defined in index.html
// Create time and freq array
t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(M1_pass+M2_pass)),5/3)/(nu_pass*Math.pow(f_i,8/3));
for (var i=0 ; i<time_points; i++){
    timeArr[i]=(i*t_coal/(time_points-1)-t_inter);
    hArr[i]=Math.pow(10,21)*(1/(440*Math.pow(10,6)*pc)*Math.cos(-2*Math.pow(5*G*M_c/Math.pow(c,3),-5/8)*Math.pow(t_coal-timeArr[i],5/8))*Math.pow(G*M_c_pass/Math.pow(c,2),5/4)*Math.pow(5/(t_coal-timeArr[i])/c,1/4));
    total_array=[timeArr[i],hArr[i]];
    arrData[i]=(total_array);

}
//Put freq and time in data map
data = arrData.map(function(d){
    return{
        time:d[0],
        h:d[1]
    };
});
data.forEach(function(d) {
    d.h = +d.h;
    d.time = +d.time;
});

// Scale the range of the data
x.domain(d3.extent(data, function(d) { return d.time; }));
y.domain(d3.extent(data, function(d) { return d.h; }));
//y.domain([d3.min(data, function(d) { return d.h; }), d3.max(data, function(d) { return d.h; })]);

// Add the valueline path.
svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Update data section (Called from the onclick)
function updateh() {
    timeArr = [];
    arrData = [];
    data = [];
    

    f_i = freq_pass;
    t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(M1_pass+M2_pass)),5/3)/(nu_pass*Math.pow(f_i,8/3));

    for (var i=0 ; i<time_points; i++){
        timeArr[i]=(i*t_coal/(time_points-1)-t_inter);
        hArr[i]=Math.pow(10,21)*(1/(440*Math.pow(10,6)*pc)*Math.cos(-2*Math.pow(5*G*M_c/Math.pow(c,3),-5/8)*Math.pow(t_coal-timeArr[i],5/8))*Math.pow(G*M_c_pass/Math.pow(c,2),5/4)*Math.pow(5/(t_coal-timeArr[i])/c,1/4));
        total_array=[timeArr[i],hArr[i]];
        arrData[i]=(total_array);
    }

    data = arrData.map(function(d){
        return{
            time:d[0],
            h:d[1]
        };
    });
    
    data.forEach(function(d) {
        d.h = +d.h;
        d.time = +d.time;
    });


    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(8);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(8);
    
    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([d3.min(data, function(d) { return d.h; }), d3.max(data, function(d) { return d.h; })]);

    var svg = d3.select("#space3").transition();
    // Define the line
    var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.h); });

    svg.select(".line")   // change the line
        .duration(750)
        .attr("d", valueline(data));
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}