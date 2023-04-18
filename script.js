// Lấy dữ liệu từ đối tượng
const data = {
    status: 200,
    respons: {
      item1: {
        data: [
          { time: "2023-04-17 00:00:00", value: "8" },
          { time: "2023-04-17 00:02:00", value: "8" },
        ],
        yAxisID: "y-axes-0",
        ymin: 0,
        ymax: 100,
        Point: 2,
        TimeFormat: 'HH:mm',
        type: "line",
        name: "DI3.Count",
        unit: "",
        color: "#335744",
      },
      item2: {
        data: [
          { time: "2023-04-17 00:00:00", value: "8" },
          { time: "2023-04-17 00:02:00", value: "8" },
        ],
        yAxisID: "y-axes-1",
        ymin: 0,
        ymax: 100,
        Point: 1,
        TimeFormat: 'HH:mm',
        type: "bar",
        name: "Power hour",
        unit: "kWh",
        color: "#b51b44",
      },
    },
  };
  const chartData = {
    datasets: [],
    labels: [],
  };
  
  if (data.respons.item1 && data.respons.item1.data.length > 0) {
    const item1 = data.respons.item1;
    const dataset1 = {
      label: item1.name,
      yAxisID: item1.yAxisID,
      data: item1.data.map((d) => d.value),
      type: item1.type,
      backgroundColor: item1.color,
      borderColor: item1.color,
      fill: item1.type === "line" ? false : undefined,
    };
    chartData.datasets.push(dataset1);
    chartData.labels = item1.data.map((d) => moment(d.time).format('HH:mm'));
  }
  
  
  if (data.respons.item2 && data.respons.item2.data.length > 0) {
    const item2 = data.respons.item2;
    const dataset2 = {
      label: item2.name,
      yAxisID: item2.yAxisID,
      data: item2.data.map((d) => d.value),
      type: item2.type,
      backgroundColor: item2.color,
      borderColor: item2.color,
    };
    chartData.datasets.push(dataset2);
    if (!chartData.labels.length) {
      chartData.labels = item2.data.map((d) => d.time.format('HH:mm'));
    }
  }
  
  // Sử dụng Chart.js để vẽ đồ thị
  const ctx = document.getElementById("myChart").getContext("2d");
  
  const myChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      plugins: {
        tooltip: {
          enabled: false
        },
      },
      responsive: true,
      legend: {
        position: "top",
        align: "end",
      },
      scales: {
        yAxes: [
          {
            yAxisID: "y-axes-0",
            id: "y-axes-0",
            type: "linear",
            position: "left",
            ticks: {
              beginAtZero: true,
              min: data.respons.item1.ymin,
              max: data.respons.item1.ymax,
              callback: function(value, index, values) {
                return value.toFixed(data.respons.item1.Point);
              }
            },
          },
          {
            yAxisID: "y-axes-1",
            id: "y-axes-1", // thêm id cho trục Y bên phải
            type: "linear",
            position: "right",
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
              min: data.respons.item2.ymin,
              max: data.respons.item2.ymax,
              callback: function(value, index, values) {
                return value.toFixed(data.respons.item2.Point);
              }
            },
          },
        ],
      },
      // thuộc tính riêng cho dataset
      datasetOptions: {
        bar: {
          yAxisID: "y-axes-1", // sử dụng trục Y bên phải cho đồ thị bar
          backgroundColor: data.respons.item2.color, // đổi màu của đồ thị bar cho item2
          borderColor: data.respons.item2.color, // đổi màu của đường viền cho item2
        },
      },
    },
  });
  
  function updateChartData() {
    // Tạo dữ liệu dummy để test
    const item1Data = [    { time: moment().format("YYYY-MM-DD HH:mm:ss"), value: Math.random() * 100 },    { time: moment().add(2, "minutes").format("YYYY-MM-DD HH:mm:ss"), value: Math.random() * 100 },  ];
    const item2Data = [    { time: moment().format("YYYY-MM-DD HH:mm:ss"), value: Math.random() * 150 },    { time: moment().add(2, "minutes").format("YYYY-MM-DD HH:mm:ss"), value: Math.random() * 150 },  ];
  
    // Cập nhật dữ liệu cho biểu đồ
    if (chartData.datasets.length >= 1) {
      chartData.datasets[0].data = item1Data.map((d) => d.value);
      chartData.labels = item1Data.map((d) => moment(d.time).format('HH:mm'));
    }
    if (chartData.datasets.length >= 2) {
      chartData.datasets[1].data = item2Data.map((d) => d.value);
      if (!chartData.labels.length) {
        chartData.labels = item2Data.map((d) => d.time);
      }
    }
  
    // Vẽ lại biểu đồ với dữ liệu mới
    myChart.update();
  }
  
  // Cập nhật dữ liệu và vẽ đồ thị sau mỗi 2 phút
  setInterval(updateChartData, 2 * 60 * 1000);