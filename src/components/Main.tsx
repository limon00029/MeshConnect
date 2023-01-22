import React, { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import "../css/mainPage.css";
import "../css/connectPage.css";
import { Button } from "react-bootstrap";

const BROADCAST = (_ip: string, msg: string) =>
  `http://${_ip}:42001/broadcast=${msg}`;
const SENSOR = (_ip: string, name: string, value: any) =>
  `http://${_ip}:42001/sensor-update=${name}=${value}`;
const VALUE = (_ip: string, name: string, value: any) =>
  `http://${_ip}:42001/vars-update=${name}=${value}`;

function Main() {
  const [ip, setIp] = useState("127.0.0.1");
  const [isConnected, setIsConnected] = useState(false);

  const ConnectDone = (_ip: string) => {
    setIp(_ip);
    setIsConnected(true);
  };

  function ConnectPage() {
    const ipAddress = useRef<any>();
    const [error, setError] = useState(false);
    const [connecting, setConnecting] = useState(false);

    function OnClickSubmitBtn() {
      setConnecting(true);
      setError(false);

      const regex = /\d{1,}.\d{1,}.\d{1,}.\d{1,}/;
      console.log(regex.test(ipAddress.current.value));

      if (!regex.test(ipAddress.current.value)) {
        setConnecting(false);
        setError(true);
        return;
      }

      axios
        .get(BROADCAST(ipAddress.current.value, ""), { timeout: 5000 })
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            ConnectDone(ipAddress.current.value);
          } else {
            setConnecting(false);
            setError(true);
            ConnectDone(ipAddress.current.value);
          }
        })
        .catch((err) => {
          console.log(err);
          setConnecting(false);
          setError(true);
        });
    }

    return (
      <div>
        <div id="container">
          <div className="InputWrapper">
            <p className="input-title">IP주소 : </p>
            <input
              type="text"
              className="form-control ip-input"
              placeholder="127.0.0.1"
              ref={ipAddress}
            />
            <div className="buttonWrapper">
              <Button
                variant="primary"
                id="submit-btn"
                onClick={OnClickSubmitBtn}
              >
                연결하기
              </Button>
            </div>
          </div>
        </div>
        {connecting ? <p>연결 중...</p> : null}
        {error ? <p className="connect-fail">연결에 실패했습니다.</p> : null}
      </div>
    );
  }

  function MainPage() {
    const [power, setPower] = useState(false);
    const msgRef = useRef<any>();
    const varNameRef = useRef<any>();
    const varValueRef = useRef<any>();

    const OnClickBroadCast = () => {
      axios
        .get(BROADCAST(ip, msgRef.current.value), { timeout: 3000 })
        .then((res) => {
          
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const OnClickVarChange = () => {
      axios
        .get(VALUE(ip, varNameRef.current.value, varNameRef.current.value), { timeout: 3000 })
        .then((res) => {
          
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const SendDirect = (e : React.MouseEvent<HTMLDivElement>) => {
      switch(e.currentTarget.id) {
        case "up-triangle":
          BROADCAST(ip, "up");
          break;
        case "down-triangle":
          BROADCAST(ip, "down");
          break;
        case "left-triangle":
          BROADCAST(ip, "left");
          break;
        case "right-triangle":
          BROADCAST(ip, "right");
          break;
      }
    };

    const OnClickPower = () => {
      if(power) {
        setPower(false);
        BROADCAST(ip, "poweroff");
      } else {
        setPower(true);
        BROADCAST(ip, "poweron");
      }
    };

    return (
      <div id="main-container">
        <p className="btn btn-info myiptitle">내 ip : {ip}</p>
        <div className="OneLineInputWrapper">
          <input type="text" className="form-control" placeholder="메시지를 입력해주세요" ref={msgRef}/>
          <Button variant="primary" id="broadcast-btn1" className="broadcast-btn" onClick={OnClickBroadCast}>방송 보내기</Button>
        </div>
        <hr className="solid" />
        <div className="TwoLineInputWrapper">
          <div className="LeftWrapper">
            <div className="LeftItemWrapper">
              <span className="item-title">변수명</span>
              <input type="text" className="form-control input-var" placeholder="변수명" ref={varNameRef}/>
            </div>
            <div className="LeftItemWrapper" style={{margin: "5px 0 0 0"}}>
              <span className="item-title">변수값</span>
              <input type="text" className="form-control input-var" placeholder="변수값" ref={varValueRef}/>
            </div>
          </div>
          <Button className="sendVarBtn" onClick={OnClickVarChange}>변수값<br/>보내기</Button>
        </div>
        <hr className="solid" />
        <div className="BtnWrapper">
          <div className="remote-container">
            <div></div>
            <div id="up-triangle" onClick={SendDirect}></div>
            <div></div>
            <div id="left-triangle" onClick={SendDirect}></div>
            <div></div>
            <div id="right-triangle" onClick={SendDirect}></div>
            <div></div>
            <div id="down-triangle" onClick={SendDirect}></div>
            <div></div>
          </div>
          <div className="power-on-btn" onClick={OnClickPower}></div>
          <div className="power-off-btn" onClick={OnClickPower}></div>
        </div>
      </div>
    );
  }

  return <div>{isConnected ? <MainPage /> : <ConnectPage />}</div>;
}

export default Main;
