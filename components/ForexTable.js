import React from "react";
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
  background-color: rgba(90, 100, 110, 0.9);
`;

const Title = styled.h1`
  font-size: 64px;
  font-family: "ADLaM Display", cursive;
  color: rgba(0, 0, 0, 0.9);
  text-shadow: 0 0.15ch 15px rgba(0, 0, 0, 0.5),
    0 -2px 0 rgba(255, 255, 255, 0.5);
`;

const Graph = styled.div`
  display: flex;
  gap: 32px;
  padding: 40px;
  justify-content: center;
`;

const InfoSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 220px;
  border: 2px solid rgba(230, 230, 235, 0.6);
  padding: 1rem;
  height: fit-content;
  border-radius: 4px;
  font-size: 18px;
  box-shadow: 0px 0px 15px 3px rgba(230, 230, 235, 0.4);
  color: #fff;
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

  &:first-child {
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
  }
`;

const Cell = styled.div`
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  color: #fff;
`;

const FetchDataBtn = styled.button`
  width: 150px;
  height: 50px;
  font-family: "ADLaM Display", cursive;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #000;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  text-transform: uppercase;

  &:active {
    transform: translateY(2px);
    background-color: #eff;
  }
`;

const InputFile = styled.input`
  width: 420px;
  padding: 8px;
  border-radius: 5px;
  border: 2px solid #000;
  box-shadow: inset 0px 0px 5px 1px rgba(0, 0, 0, 0.4);
  color: #fff;

  &::file-selector-button {
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: #fff;
    height: 50px;
    width: 150px;
    cursor: pointer;
    font-size: 16px;
    font-family: "ADLaM Display", cursive;
    margin-right: 16px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
  }
`;

const GraphContainer = styled.div`
  width: 1200px;
  height: 460px;
  background-color: rgba(250, 250, 250, 0.8);
  position: relative;
  margin-bottom: 30px;
  border-radius: 3px;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.4) inset;
`;

const YAxisLine = styled.div`
  width: 10px;
  height: 2px;
  background-color: #fff;
`;

const YAxisValue = styled.div`
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  left: -80px;
  bottom: ${({ positionb }) => `${positionb}px`};
  color: #fff;
`;

const XAxisLine = styled.div`
  width: 2px;
  height: 10px;
  background-color: #fff;
`;

const XAxisValue = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  left: ${({ positionl }) => `${positionl}px`};
  bottom: -20px;
  font-size: 8px;
  color: #fff;
`;

const LowHighLine = styled.div`
  width: 4px;
  border-radius: 15px;
  position: absolute;
  bottom: ${({ positionb }) => `${positionb}px`};
  left: ${({ positionl }) => `${positionl}px`};
  height: ${({ lineheight }) => `${lineheight}px`};
  background: linear-gradient(
    105deg,
    rgba(204, 193, 193, 1) 48%,
    rgba(177, 177, 177, 1) 74%
  );
  opacity: 0.5;
  box-shadow: 0px 0px 1px 1px rgba(40, 40, 30, 0.3) inset;
`;

const OpenCloseBar = styled.div`
  width: ${({ widthpixels }) => `${widthpixels}px`};
  background: ${({ color }) => color};
  position: absolute;
  bottom: ${({ positionb }) => `${positionb}px`};
  left: ${({ positionl }) => `${positionl}px`};
  height: ${({ barheight }) => `${barheight}px`};
  opacity: 0.95;
  border-radius: 2px;
  transition: all 0.3s ease;
  box-shadow: 0px 0px 10px 1px rgba(40, 40, 30, 0.3);

  &:hover {
    scale: 1.02;
    opacity: 0.8;
  }
`;

const ForexTable = () => {
  const [fileDoc, setFileDoc] = useState([]);
  const [usableData, setUsableData] = useState([]);
  const [compilation, setCompilation] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  const [pretty, setPretty] = useState([]);
  const [xAxisV, setXAxisV] = useState([]);
  const [valuesAndPoints, setValuesAndPoints] = useState([]);
  const [lowHighDifferenceValue, setLowHighDifferenceValue] = useState(0);
  const [lowest, setLowest] = useState(0);
  const [xAxisPointsDistance, setXAxisPointsDistance] = useState(0);
  const [graph, setGraph] = useState([]);
  const [selectedBar, setSelectedBar] = useState();

  const convertText = () => {
    let arrayFromText = fileDoc.split(/\r?\n/);

    let data = arrayFromText.map((item, _) => item.split(","));

    let dataObjects = data.map((data, _) => {
      let keys = ["date", "time", "open", "high", "low", "close", "volume"];

      const obj = Object.fromEntries(
        keys.map((key, index) => [key, data[index]])
      );

      return obj;
    });

    const chartData = dataObjects.filter((element) => element.time === "18:00");

    setUsableData(dataObjects);

    let startingDate = dataObjects[0].date;
    let currentDate = startingDate;
    let low = 100000;
    let high = 0;
    let openDayPrice = dataObjects[0].open;
    let dayArray = [];
    let compilationArray = [];

    dataObjects.map((el, idx) => {
      if (el.date === currentDate) {
        low = Math.min(low, el.low);
        high = Math.max(high, el.high);
      } else {
        compilationArray.push({
          date: currentDate,
          low: low,
          high: high,
          close: dataObjects[idx - 1].close,
          open: openDayPrice,
        });
        currentDate = el.date;
        low = 100000;
        high = 0;
        dayArray = [];
        openDayPrice = dataObjects[idx].open;
      }
      dayArray.push({ date: currentDate, low: low, high: high });
    });

    setCompilation(compilationArray);

    let lowestPrice = 1000000;
    let highestPrice = 0;
    compilationArray.map((el, idx) => {
      lowestPrice = Math.min(lowestPrice, el.low);
      highestPrice = Math.max(highestPrice, el.high);
    });

    setLowest(lowestPrice);

    let lowHighDifference = highestPrice - lowestPrice;

    setLowHighDifferenceValue(lowHighDifference);

    let yAxisPointsNumber = 10;

    let yAxisPointsStep = lowHighDifference / yAxisPointsNumber;

    const lowHighLineHeightInPixels = (low, high) => {
      let result;
      if (low > high) {
        result = (low - high) / (lowHighDifference / 450);
      } else {
        result = (high - low) / (lowHighDifference / 450);
      }

      return result;
    };

    const openCloseHeightInPixels = (open, close) => {
      let result;
      if (open > close) {
        result = (open - close) / (lowHighDifference / 450);
      } else {
        result = (close - open) / (lowHighDifference / 450);
      }
      return result;
    };

    let graphElementsInPixelsArray = [];

    compilationArray.map((el, idx) => {
      graphElementsInPixelsArray[idx] = {
        lowHighLineHeightPixels: Number(
          lowHighLineHeightInPixels(el.low, el.high).toFixed(5)
        ),
        openCloseHeightPixels: Math.abs(
          Number(openCloseHeightInPixels(el.open, el.close).toFixed(5))
        ),
        ...el,
      };
    });

    setGraph(graphElementsInPixelsArray);

    let xAxisPointsNum = graphElementsInPixelsArray.length;

    let xAxisPointsDistanceInPixels = 1200 / xAxisPointsNum;

    setXAxisPointsDistance(xAxisPointsDistanceInPixels);

    let xAxisPositions = [];
    let start = 0;

    for (let i = 0; i <= xAxisPointsNum; i++) {
      xAxisPositions[i] = start;
      start = start + xAxisPointsDistanceInPixels;
    }

    setXAxis(xAxisPositions);

    const yAxisValues = [];

    for (let i = 0; i <= 10; i++) {
      yAxisValues[0] = Number(lowestPrice);
      yAxisValues[i + 1] = yAxisValues[i] + Number(yAxisPointsStep);
    }

    let prettyValues = yAxisValues.map((val, _) => {
      return val.toFixed(4);
    });

    let chartDataDateAndClosingPrice = [];

    compilationArray.map((element, idx) => {
      let convertedDate = new Date(element.date).toLocaleDateString("en-GB");
      chartDataDateAndClosingPrice[idx] = {
        label: convertedDate,
        y: Number(element.close),
      };
    });

    const xAxisValues = [];

    chartDataDateAndClosingPrice.map(
      (el, idx) =>
        (xAxisValues[idx] = {
          value: el.label,
          position: idx * 10,
        })
    );

    let yAxisPositions = [
      0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440,
    ];

    let valuesAndPointsMap = [];

    for (let i = 0; i <= 11; i++) {
      let obj = {
        value: prettyValues[i],
        pointPosition: yAxisPositions[i],
      };
      valuesAndPointsMap[i] = obj;
    }

    setPretty(prettyValues);
    setXAxisV(xAxisValues);
    setValuesAndPoints(valuesAndPointsMap);
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
    "LOWEST PRICE",
    "HIGHEST PRICE",
    "CLOSING PRICE",
    "OPENING PRICE",
  ];

  return (
    <Container>
      <Title>FOREX CHARTS</Title>
      <Graph>
        <GraphContainer>
          {pretty.map((el, idx) => (
            <YAxisValue
              key={idx}
              positionb={valuesAndPoints[idx].pointPosition}
            >
              ${valuesAndPoints[idx].value}
              <YAxisLine />
            </YAxisValue>
          ))}
          {xAxisV.map((el, idx) => (
            <XAxisValue key={idx} positionl={xAxis[idx]}>
              <XAxisLine />
              {el.value}
            </XAxisValue>
          ))}
          {graph.map((el, idx) => (
            <div key={idx}>
              <LowHighLine
                positionb={
                  el.low / (lowHighDifferenceValue / 450) -
                  lowest / (lowHighDifferenceValue / 450)
                }
                positionl={xAxis[idx] + xAxisPointsDistance / 2 - 2}
                lineheight={el.lowHighLineHeightPixels}
              />
              <OpenCloseBar
                widthpixels={xAxisPointsDistance}
                onMouseEnter={() => {
                  setSelectedBar(compilation[idx]);
                }}
                onMouseLeave={() => {
                  setSelectedBar();
                }}
                barInformation={el}
                positionb={
                  el.close > el.open
                    ? el.open / (lowHighDifferenceValue / 450) -
                      lowest / (lowHighDifferenceValue / 450)
                    : el.close / (lowHighDifferenceValue / 450) -
                      lowest / (lowHighDifferenceValue / 450)
                }
                positionl={xAxis[idx]}
                barheight={
                  el.openCloseHeightPixels === 0 ? 1 : el.openCloseHeightPixels
                }
                color={
                  el.open > el.close
                    ? "linear-gradient(105deg, rgba(170,15,41,1) 26%, rgba(173,57,18,1) 74%)"
                    : "linear-gradient(105deg, rgba(115,180,73,1) 37%, rgba(118,222,82,1) 68%, rgba(71,241,82,1) 99%)"
                }
              />
            </div>
          ))}
        </GraphContainer>
        <InfoSidebar>
          <p>
            Date:{" "}
            {selectedBar &&
              new Date(selectedBar.date).toLocaleDateString("en-GB")}
          </p>
          <p>Low: {selectedBar && selectedBar.low}</p>
          <p>High: {selectedBar && selectedBar.high}</p>
          <p>Open: {selectedBar && selectedBar.open}</p>
          <p>Close: {selectedBar && selectedBar.close}</p>
        </InfoSidebar>
      </Graph>
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
        {compilation.length > 0 &&
          compilation.map((row, id) => (
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
