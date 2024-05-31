"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

interface LineChartProps {
  dzietnosc: any;
  data: any;
  labels: string[];
  tabela: string;
  eventBorders: {
    left: number;
    right: number;
  };
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  dzietnosc,
  tabela,
  eventBorders,
}) => {
  // Obliczanie średnich wartości dla każdego roku
  const averageData: { [key: string]: number } = {};
  dzietnosc.forEach((item: any) => {
    Object.keys(item).forEach((key: string) => {
      if (key.startsWith("r20")) {
        const value = parseFloat(item[key].replace(",", "."));
        if (!averageData[key]) {
          averageData[key] = 0;
        }
        averageData[key] += value;
      }
    });
  });
  Object.keys(averageData).forEach((key: string) => {
    averageData[key] = parseFloat(
      (averageData[key] / dzietnosc.length).toFixed(2)
    );
  });

  //Filtrowanie po roku dzietnosci
  const orderedValues: number[] = labels.map(
    (label: string) => averageData[label]
  );

  // Transformacja danych z przecinkami na kropki
  const transformedData = data.map((item: any) => {
    const transformedItem: any = {};
    Object.keys(item).forEach((key) => {
      if (key.startsWith("r20")) {
        transformedItem[key] = item[key].replace(",", ".").replace(" ", "");
      } else {
        transformedItem[key] = item[key];
      }
    });
    return transformedItem;
  });

  // Obliczanie średniej wartości dla każdego roku w data
  const averageDataForData: { [key: string]: number } = {};
  transformedData.forEach((item: any) => {
    Object.keys(item).forEach((key: string) => {
      if (key.startsWith("r20")) {
        const value = parseFloat(item[key]);
        if (!averageDataForData[key]) {
          averageDataForData[key] = 0;
        }
        averageDataForData[key] += value;
      }
    });
  });
  Object.keys(averageDataForData).forEach((key: string) => {
    averageDataForData[key] = parseFloat(
      (averageDataForData[key] / transformedData.length).toFixed(2)
    );
  });

  // Dodanie średniej wartości dla wszystkich lat jako "Polska" w transformedData
  const polskaAverage = {
    Nazwa: "Polska (średnia dla wybranych województw)",
    ...averageDataForData,
  };
  transformedData.unshift(polskaAverage);

  const colors = [
    "red",
    "yellow",
    "green",
    "blue",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
    "cyan",
    "magenta",
    "teal",
    "lime",
    "indigo",
    "maroon",
    "gold",
  ];
  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Stosunek dzietności do ${tabela}`,
      },
      annotation: {
        annotations: [
          {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: eventBorders.left,
            borderColor: "blue",
            borderWidth: 3,
            borderDash: [15, 15],
          } as any,
          {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: eventBorders.right,
            borderColor: "blue",
            borderWidth: 3,
            borderDash: [15, 15],
          } as any,
          {
            type: "box",
            xScaleID: "x",
            yScaleID: "y",
            xMin: eventBorders.left,
            xMax: eventBorders.right,
            backgroundColor: "rgba(0, 0, 255, 0.05)",
          },
        ],
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Wskaźnik dzietności w Polsce",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: `${tabela}  [${
            tabela === "pkb"
              ? "PLN"
              : tabela === "bezrobocie"
              ? "%"
              : tabela === "srednie_wynagrodzenie"
              ? "PLN"
              : "lata"
          }]`,
        },
      },
    },
  };
  const chartData = {
    labels,
    datasets: [
      {
        label: "Średni wskaźnik dzietności w Polsce",
        data: orderedValues,
        borderColor: "navy",
        backgroundColor: "navy",
        yAxisID: "y",
      },
      ...transformedData.map((item: any, index: number) => ({
        label: item.Nazwa,
        data: labels.map((label: string) => item[label]),
        borderColor: colors[index],
        backgroundColor: colors[index],
        yAxisID: "y1",
      })),
    ],
  };

  if (tabela === "dzietnosc") {
    return null;
  }
  return (
    <>
      <Line data={chartData} options={options} />
    </>
  );
};

export default LineChart;
