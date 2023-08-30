import React, { useEffect } from "react";
import { styled } from "styled-components";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px;
  gap: 32px;
`;

const Table = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Cell = styled.div`
  flex: 1;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const FetchDataBtn = styled.button`
  width: 150px;
  height: 50px;
  background-color: aliceblue;
  cursor: pointer;
  border-radius: 15px;
  border: none;
  box-shadow: 0px 0px 10px 2px black;
`;

const InputFile = styled.input`
  border: 1px solid black;
`;

const GraphContainer = styled.div`
  width: 1200px;
  height: 450px;
  background-color: rgba(0, 0, 0, 0.05);
  position: relative;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  margin-bottom: 50px;
`;

const YAxisLine = styled.div`
  width: 10px;
  height: 2px;
  background-color: black;
`;

const YAxisValue = styled.div`
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  left: -80px;
  bottom: ${({ positionb }) => `${positionb}px`};
`;

const XAxisLine = styled.div`
  width: 2px;
  height: 10px;
  background-color: black;
`;

const XAxisValue = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-items: center; */
  position: absolute;
  left: ${({ positionl }) => `${positionl}px`};
  bottom: -21px;
  font-size: 10px;
`;

const LowHighLine = styled.div`
  width: 2px;
  position: absolute;
  bottom: ${({ positionb }) => `${positionb}px`};
  left: ${({ positionl }) => `${positionl}px`};
  height: ${({ lineheight }) => `${lineheight}px`};
  background-color: gray;
`;

const OpenCloseBar = styled.div`
  width: ${({ widthpixels }) => `${widthpixels}px`};
  background-color: ${({ color }) => color};
  position: absolute;
  bottom: ${({ positionb }) => `${positionb}px`};
  left: ${({ positionl }) => `${positionl}px`};
  height: ${({ barheight }) => `${barheight}px`};
`;

const ForexTable = () => {
  const [fileDoc, setFileDoc] = useState([]);
  const [usableData, setUsableData] = useState([]);
  const [chart, setChart] = useState([]);

  const convertText = () => {
    let arrayFromText = fileDoc.split(/\r?\n/);

    let data = arrayFromText.map((item, id) => item.split(","));

    let dataObjects = data.map((data, id) => {
      let keys = ["date", "time", "open", "high", "low", "close", "volume"];

      const obj = Object.fromEntries(
        keys.map((key, index) => [key, data[index]])
      );

      return obj;
    });

    const chartData = dataObjects.filter((element) => element.time === "18:00");
    setChart(chartData);

    // const slicedArray = dataObjects.slice(0, 50);

    setUsableData(dataObjects);
  };

  let reader;

  const handleFileRead = (e) => {
    const content = reader.result;
    setFileDoc(content);
  };

  const fetchData = (file) => {
    reader = new FileReader();
    reader.onloadend = handleFileRead;
    reader.readAsText(file);
  };
  const headers = [
    "DATE",
    "TIME",
    "OPENING PRICE",
    "HIGHEST PRICE",
    "LOWEST PRICE",
    "CLOSING PRICE",
    "VOLUME",
  ];

  let lowestPrice = 2;
  let highestPrice = 0;
  usableData.map((el, idx) => {
    if (el.low < lowestPrice) {
      lowestPrice = el.low;
    }
    if (el.high > highestPrice) {
      highestPrice = el.high;
    }
  });

  let lowHighDifference = highestPrice - lowestPrice;

  let yAxisPointsNumber = 10;

  let yAxisPointsStep = lowHighDifference / yAxisPointsNumber;

  const lowHighLineHeightInPixels = (low, high) => {
    let result = (high - low) / (lowHighDifference / 450);
    return result;
  };

  const openCloseHeightInPixels = (open, close) => {
    let result = (close - open) / (lowHighDifference / 450);
    return result;
  };

  let graphElementsInPixelsArray = [];

  usableData
    .filter((el) => el.time === "18:00")
    .map((el, idx) => {
      graphElementsInPixelsArray[idx] = {
        lowHighLineHeightPixels: Number(
          lowHighLineHeightInPixels(el.low, el.high).toFixed(5)
        ),
        openCloseHeightPixels: Math.abs(
          Number(openCloseHeightInPixels(el.close, el.open).toFixed(5))
        ),
        ...el,
      };
    });

  console.log(graphElementsInPixelsArray);

  let xAxisPointsNum = graphElementsInPixelsArray.length;

  let xAxisPointsDistanceInPixels = 1200 / xAxisPointsNum;

  let xAxisPositions = [];

  let start = 0;

  for (let i = 0; i <= xAxisPointsNum; i++) {
    xAxisPositions[i] = start;
    start = start + xAxisPointsDistanceInPixels;
  }

  // console.log("usable data", usableData);
  // console.log("lowest", lowestPrice);
  // console.log("highest", highestPrice);
  // console.log("difference", lowHighDifference);
  // console.log("step", yAxisPointsStep.toFixed(5));
  console.log("a pixel corresponds to", lowHighDifference / 450);

  console.log(
    "the starting point of the y axis",
    lowestPrice / (lowHighDifference / 450)
  );

  // let yAxisStartingPoint = lowestPrice / (lowHighDifference / 450);

  // const findValuePositionInPixels = (start, value) => {
  //   let position = value / (lowHighDifference / 450);
  //   return position - start;
  // };

  const yAxisValues = [];

  for (let i = 0; i <= 10; i++) {
    yAxisValues[0] = Number(lowestPrice);
    yAxisValues[i + 1] = yAxisValues[i] + Number(yAxisPointsStep);
  }

  let prettyValues = yAxisValues.map((val, _) => {
    return val.toFixed(5);
  });

  //start herreeeeeeeee

  let chartDataDateAndClosingPrice = [];

  chart.map((element, idx) => {
    chartDataDateAndClosingPrice[idx] = {
      label: element.date,
      y: Number(element.close),
    };
  });

  const xAxisValues = [];

  chartDataDateAndClosingPrice.map(
    (el, idx) => (xAxisValues[idx] = { value: el.label, position: idx * 10 })
  );

  let yAxisPositions = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440];

  let valuesAndPointsMap = [];

  for (let i = 0; i <= 11; i++) {
    let obj = { value: prettyValues[i], pointPosition: yAxisPositions[i] };
    valuesAndPointsMap[i] = obj;
  }

  return (
    <Container>
      <GraphContainer>
        {prettyValues.map((el, idx) => (
          <YAxisValue
            key={idx}
            positionb={valuesAndPointsMap[idx].pointPosition}
          >
            ${valuesAndPointsMap[idx].value}
            <YAxisLine />
          </YAxisValue>
        ))}
        {xAxisValues.map((el, idx) => (
          <XAxisValue key={idx} positionl={xAxisPositions[idx]}>
            <XAxisLine />
            {el.value}
          </XAxisValue>
        ))}
        {graphElementsInPixelsArray.map((el, idx) => (
          <div key={idx}>
            <LowHighLine
              positionb={
                el.low / (lowHighDifference / 450) -
                lowestPrice / (lowHighDifference / 450)
              }
              positionl={xAxisPositions[idx] + xAxisPointsDistanceInPixels / 2}
              lineheight={el.lowHighLineHeightPixels}
            />
            <OpenCloseBar
              widthpixels={xAxisPointsDistanceInPixels}
              positionb={
                el.open / (lowHighDifference / 450) -
                lowestPrice / (lowHighDifference / 450)
              }
              positionl={xAxisPositions[idx]}
              barheight={
                el.openCloseHeightPixels === 0 ? 1 : el.openCloseHeightPixels
              }
              color={el.open > el.close ? "red" : "lime"}
            />
          </div>
        ))}
      </GraphContainer>
      <InputFile
        type="file"
        onChange={(e) => {
          fetchData(e.target.files[0]);
        }}
      />
      <FetchDataBtn onClick={convertText}>Open csv</FetchDataBtn>
      <Table>
        <TableRow>
          {headers.map((item, idx) => (
            <Cell key={idx}>{item}</Cell>
          ))}
        </TableRow>
        {usableData.length > 0 &&
          usableData
            .filter((el) => el.time === "18:00")
            .map((row, id) => (
              <TableRow key={id}>
                {Object.keys(row).map((cellData, idx) => (
                  <Cell key={idx}>{row[cellData]}</Cell>
                ))}
              </TableRow>
            ))}
      </Table>
    </Container>
  );
};

export default ForexTable;
