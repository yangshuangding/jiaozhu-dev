import React, { useEffect } from 'react'
import { Modal, Button, Space } from 'antd';
import styled from 'styled-components'
import SVG from 'react-inlinesvg';
import logo from '../../assets/logo.svg';
import './page1.css';
// import { loadModules, loadCss } from "esri-loader";
// loadCss();
// import LeaderLine from './leader-line.js'

const StyledButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid red;
  color: red;
  margin: 0 1em;
  padding: 0.25em 1em;
`

function getDataFromBase () {
  Modal.info({
    title: '主动获取数据',
    content: (
      <div>
        <p>来自基座的数据 {JSON.stringify(window.microApp?.getData() ?? '')}</p>
      </div>
    ),
    onOk() {},
  });
}

/**
 * 跨域无法直接通过a标签download下载
 * 降级为通过blob下载文件
 */
function download (e) {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    e.preventDefault()
    fetch(e.target.href).then((res) => {
      res.blob().then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        // 这里的文件名根据实际情况从响应头或者url里获取
        const filename = 'filename.svg';
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      });
    });
  }
}

function controlBase () {
  window.microApp.router.getBaseAppRouter()?.push('/vue2')
}

function Page1() {
  function dispatchData () {
    // window.microApp?.dispatch({'from': `来自子应用${window.__MICRO_APP_NAME__}的数据` + (+new Date())})
    window.microApp?.dispatch({ childKey: '子应用发送的第二个数据' }, (res) => {
      console.log('向基座发送数据完成', res)

      // 循环嵌套
      // window.microApp?.dispatch({ childKey4: '子应用发送的第4个数据' }, () => {
      //   console.log('循环嵌套发送数据完成')
      // })
    })
    // 强制发送数据
    window.microApp?.forceDispatch({ childKey3: '子应用发送的第三个数据' }, (res) => {
      console.log('强制向基座发送数据完成', res)
    })
  }


  useEffect(() => {
    // setInterval(() => {
    //   console.log(`子应用${window.__MICRO_APP_NAME__}的setInterval`)
    // }, 5000)
  //   loadModules(["esri/Map", "esri/views/MapView"])
  //   .then(([Map, MapView]) => {
  //     const map = new Map({
  //       basemap: "topo-vector",
  //     });
  //     console.log(222222, document.getElementById('view-div'))
  //     const view = new MapView({
  //       container: document.getElementById('view-div'),
  //       map: map,
  //       center: [118.24, 34.01],
  //       zoom: 12,
  //     });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  // new LeaderLine(
  //   document.getElementById('start'),
  //   document.getElementById('end')
  // );

  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          React@{React.version}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className='btn-con2' clstag="pageclick|keycount|home2013|08a">
        <Space direction='vertical'>
          <Button type="primary" onClick={dispatchData}>
            向基座应用发送数据
          </Button>
          <Button type="primary" onClick={getDataFromBase}>
            主动获取数据
          </Button>
          <Button type="primary" onClick={controlBase}>
            控制基座跳转到子应用vue2
          </Button>
        </Space>
      </div>
      <div>
        <SVG src={logo} width={60} />
      </div>
      <div className='test-cssrules-a'>test-cssrules-a</div>
      <div className='test-cssrules-b'>test-cssrules-b</div>
      <div>
        <p>styled-component👇</p>
        <StyledButton>按钮</StyledButton>
      </div>
      <div>
        <a href={`${process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3001'}/micro-app/react16/static/media/logo.6ce24c58.svg`} download="w3logo" onClick={download}>下载</a>
      </div>
      {/* <div id='view-div'></div> */}
      {/* <div id="start">start</div>
      <div id="end">end</div> */}
    </div>
  );
}

export default Page1;
