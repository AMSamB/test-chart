$(document).ready(function() {

  var TITLE = 'Test chart, location, 2Q 2019–1Q 2021';

  // `false` for vertical column chart, `true` for horizontal bar chart
  var HORIZONTAL = false;

	// `false` for individual bars, `true` for stacked bars
  var STACKED = true;  
  
  // Which column defines 'bucket' names?
  var LABELS = 'quarter';  

  // For each column representing a data series, define its name and color
  var SERIES = [  
    {
      column: 'op A',
      name: 'Op A',
      color: '#29AEFF'
    },
    {
      column: 'op B',
      name: 'Op B',
      color: '#D63EAE'
    },
    {
      column: 'op C',
      name: 'Op C',
      color: '#221F72'
    },
    {
      column: 'op D',
      name: 'Op D',
      color: '#F25C5C'
    },
    {
      column: 'op E',
      name: 'Op E',
      color: '#5F6D21'
    }
  ];

  // x-axis label and label in tooltip
  var X_AXIS = 'Test';

  // y-axis label, label in tooltip
  var Y_AXIS = 'Share';

  // `true` to show the grid, `false` to hide
  var SHOW_GRID = false; 

  // `true` to show the legend, `false` to hide
  var SHOW_LEGEND = true; 

  // Read data file with random string generated by current time
  // to bypass browser cache, and create chart
  $.get('./data.csv', {'_': $.now()}, function(csvString) {

    var rows = Papa.parse(csvString, {header: true}).data;

    var datasets = SERIES.map(function(el) {
      return {
        label: el.name,
        labelDirty: el.column,
        backgroundColor: el.color,
        data: []
      }
    });

    rows.map(function(row) {
      datasets.map(function(d) {
        d.data.push(row[d.labelDirty])
      })
    });

		var barChartData = {
      labels: rows.map(function(el) { return el[LABELS] }),
			datasets: datasets
    };

    var ctx = document.getElementById('container').getContext('2d');

    new Chart(ctx, {
      type: HORIZONTAL ? 'horizontalBar' : 'bar',
      data: barChartData,
      
      options: {
        title: {
          display: true,
          text: TITLE,
          fontSize: 14,
        },
        legend: {
          display: SHOW_LEGEND,
	  position: 'bottom',
        },
        scales: {
          xAxes: [{
            stacked: STACKED,
            scaleLabel: {
              display: X_AXIS !== '',
              labelString: X_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return value.toLocaleString();
              }
            }
          }],
          yAxes: [{
	    type: 'percentage',	  
            stacked: STACKED,
            beginAtZero: true,
            scaleLabel: {
              display: Y_AXIS !== '',
              labelString: Y_AXIS
            },
            gridLines: {
              display: SHOW_GRID,
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return value.toLocaleString()
              }
            }
          }]
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            label: function(tooltipItem, all) {
              return all.datasets[tooltipItem.datasetIndex].label
                + ': ' + tooltipItem.yLabel.toLocaleString();
            }
          }
        }
      }
    });

  });

});
