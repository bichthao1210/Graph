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
      TimeFormat: "HH:mm",
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
      TimeFormat: "HH:mm",
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

for (const key in data.respons) {
  const item = data.respons[key];
  if (item.data.length > 0) {
    const dataset = {
      label: item.name,
      yAxisID: item.yAxisID,
      data: item.data.map((d) => d.value),
      type: item.type,
      backgroundColor: item.color,
      borderColor: item.color,
      fill: item.type === "line" ? false : undefined,
    };
    chartData.datasets.push(dataset);
    if (!chartData.labels.length) {
      chartData.labels = item.data.map((d) => moment(d.time).format("HH:mm"));
    }
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
        enabled: false,
      },
    },
    responsive: true,
    legend: {
      position: "top",
      align: "end",
    },
    scales: {
      yAxes: Object.keys(data.respons).map((key) => ({
        yAxisID: data.respons[key].yAxisID,
        id: data.respons[key].yAxisID,
        type: "linear",
        position: data.respons[key].yAxisID === "y-axes-0" ? "left" : "right",
        gridLines: {
          display: data.respons[key].yAxisID === "y-axes-0" ? true : false,
        },
        ticks: {
          beginAtZero: true,
          min: data.respons[key].ymin,
          max: data.respons[key].ymax,
          callback: function (value, index, values) {
            return value.toFixed(data.respons[key].Point);
          },
        },
      })),
    },
    datasetOptions: Object.keys(data.respons).reduce((acc, key) => {
      if (data.respons[key].type === "bar") {
        acc["bar"] = {
          yAxisID: data.respons[key].yAxisID,
          backgroundColor: data.respons[key].color,
          borderColor: data.respons[key].color,
        };
      }
      return acc;
    }, {}),
  },
});


function updateChartData() {
  // Tạo dữ liệu dummy để test
  const item1Data = [
    {
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      value: Math.random() * 100,
    },
    {
      time: moment().add(2, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      value: Math.random() * 100,
    },
  ];
  const item2Data = [
    {
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      value: Math.random() * 150,
    },
    {
      time: moment().add(2, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      value: Math.random() * 150,
    },
  ];

  // Cập nhật dữ liệu cho biểu đồ
  if (chartData.datasets.length >= 1) {
    chartData.datasets[0].data = item1Data.map((d) => d.value);
    chartData.labels = item1Data.map((d) => moment(d.time).format("HH:mm"));
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
