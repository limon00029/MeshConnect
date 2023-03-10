import React, { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import "../css/mainPage.css";
import "../css/connectPage.css";
import { Button } from "react-bootstrap";

const BROADCAST = async (_ip: string, msg: string, resultFunc: Function, errFunc: Function) => {
  await axios
  .get(`http://${_ip}:42001/broadcast=${msg}`, { timeout: 3000 })
  .then((res) => {
    resultFunc();
  })
  .catch((err) => {
    errFunc();
  });
}

const SENSOR = (_ip: string, name: string, value: any, resultFunc: Function, errFunc: Function) =>
  `http://${_ip}:42001/sensor-update=${name}=${value}`;

const VALUE = async (_ip: string, name: string, value: any, resultFunc: Function, errFunc: Function) => {
  await axios
  .get(`http://${_ip}:42001/vars-update=${name}=${value}`, { timeout: 3000 })
  .then((res) => {
    resultFunc();
  })
  .catch((err) => {
    console.log(err);
    errFunc();
  });
}

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

      if (!regex.test(ipAddress.current.value)) {
        setConnecting(false);
        setError(true);
        return;
      }
      BROADCAST(ipAddress.current.value, "",
        (status: number) => {
          if (status === 200) {
          ConnectDone(ipAddress.current.value);
          } else {
            setConnecting(false);
            setError(true);
            ConnectDone(ipAddress.current.value);
          }
        },
        () => {
          setConnecting(false);
          setError(true);
        }
      );
    }

    return (
      <div>
        <div id="container">
          <div className="InputWrapper">
            <p className="input-title">IP?????? : </p>
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
                ????????????
              </Button>
            </div>
          </div>
        </div>
        {connecting ? <p>?????? ???...</p> : null}
        {error ? <p className="connect-fail">????????? ??????????????????.</p> : null}
      </div>
    );
  }

  function MainPage() {
    const [power, setPower] = useState(false);
    const [sendDone, setSendDone] = useState(false);
    const [error, setError] = useState(false);
    const msgRef = useRef<any>();
    const varNameRef = useRef<any>();
    const varValueRef = useRef<any>();

    const SendDone = () => {
      setSendDone(true);
      setTimeout(() => {
        setSendDone(false);
      }, 3000)
    }

    const OnClickBroadCast = () => {
      BROADCAST(ip, msgRef.current.value, SendDone, () => {
        setError(true);
        setTimeout(() => {
          setIsConnected(false);
          setIp("127.0.0.1");
        }, 3000);
      });
    }

    const OnClickVarChange = () => {
      VALUE(ip, varNameRef.current.value, varNameRef.current.value, SendDone, () => {
        setError(true);
        setTimeout(() => {
          setIsConnected(false);
          setIp("127.0.0.1");
        }, 3000);
      });
    }

    const SendDirect = (e : React.MouseEvent<HTMLDivElement>) => {
      switch(e.currentTarget.id) {
        case "up-triangle":
          BROADCAST(ip, "up", SendDone, () => {
            setError(true);
            setTimeout(() => {
              setIsConnected(false);
              setIp("127.0.0.1");
            }, 3000);
          });
          break;
        case "down-triangle":
          BROADCAST(ip, "down", SendDone, () => {
            setError(true);
            setTimeout(() => {
              setIsConnected(false);
              setIp("127.0.0.1");
            }, 3000);
          });
          break;
        case "left-triangle":
          BROADCAST(ip, "left", SendDone, () => {
            setError(true);
            setTimeout(() => {
              setIsConnected(false);
              setIp("127.0.0.1");
            }, 3000);
          });
          break;
        case "right-triangle":
          BROADCAST(ip, "right", SendDone, () => {
            setError(true);
            setTimeout(() => {
              setIsConnected(false);
              setIp("127.0.0.1");
            }, 3000);
          });
          break;
      }
    };

    const OnClickPower = () => {
      if(power) {
        setPower(false);
        BROADCAST(ip, "poweroff", SendDone, () => {
          setError(true);
          setTimeout(() => {
            setIsConnected(false);
            setIp("127.0.0.1");
          }, 3000);
        });
      } else {
        setPower(true);
        BROADCAST(ip, "poweron", SendDone, () => {
          setError(true);
          setTimeout(() => {
            setIsConnected(false);
            setIp("127.0.0.1");
          }, 3000);
        });
      }
    };

    return (
      <div id="main-container">
        <p className="btn btn-info myiptitle">??? ip : {ip}</p>
        <div className="OneLineInputWrapper">
          <input type="text" className="form-control" placeholder="???????????? ??????????????????" ref={msgRef}/>
          <Button variant="primary" id="broadcast-btn1" className="broadcast-btn" onClick={OnClickBroadCast}>?????? ?????????</Button>
        </div>
        <hr className="solid" />
        <div className="TwoLineInputWrapper">
          <div className="LeftWrapper">
            <div className="LeftItemWrapper">
              <span className="item-title">?????????</span>
              <input type="text" className="form-control input-var" placeholder="?????????" ref={varNameRef}/>
            </div>
            <div className="LeftItemWrapper" style={{margin: "5px 0 0 0"}}>
              <span className="item-title">?????????</span>
              <input type="text" className="form-control input-var" placeholder="?????????" ref={varValueRef}/>
            </div>
          </div>
          <Button className="sendVarBtn" onClick={OnClickVarChange}>?????????<br/>?????????</Button>
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
        { sendDone ? <p className="sendDoneMsg">?????? ??????</p> : null }
        { error ? <p className="sendErrorMsg">????????? ??????????????????....</p> : null }
      </div>
    );
  }

  return <div>{isConnected ? <MainPage /> : <ConnectPage />}</div>;
}

export default Main;
