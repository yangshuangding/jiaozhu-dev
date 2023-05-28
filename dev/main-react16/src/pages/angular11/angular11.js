/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
import 'zone.js'
import { useState } from 'react'
import { Spin, Button, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import config from '../../config'
import microApp from '@micro-zoe/micro-app'

const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />

function Angular11 () {
  const [showLoading, hideLoading] = useState(true)
  const [data, changeData] = useState({frotm: '来自基座的初始化数据'})

  function jumpToPage2ByBase () {
    microApp.router.push({name: 'angular11', path: '/micro-app/angular11/page2'})
  }

  return (
    <div>
      <Col span={6} className='btn-con'>
        <Button type="primary" onClick={jumpToPage2ByBase}>控制子应用跳转page2</Button>
      </Col>
      {
        showLoading && <Spin indicator={antIcon} />
      }
      <micro-app
        name='angular11'
        url={`${config.angular11}micro-app/angular11`}
        data={data}
        onMounted={() => hideLoading(false)}
        baseRoute='/micro-app/demo/angular11'
        // destroy
        inline
        // disableScopecss
        // keep-alive
        // iframe
        // disable-memory-router
      >
      </micro-app>
    </div>
  )
}

export default Angular11
