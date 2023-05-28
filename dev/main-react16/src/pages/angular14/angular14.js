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

function Angular14 () {
  const [showLoading, hideLoading] = useState(true)
  const [data, changeData] = useState({frotm: '来自基座的初始化数据'})

  function jumpToPage (path) {
    microApp.router.push({ name: 'angular14', path })
  }

  return (
    <div>
      <Col span={6} className='btn-con'>
        <Button type="primary" onClick={jumpToPage.bind(this, '/micro-app/angular14/')}>控制子应用跳转home</Button>
        <Button type="primary" onClick={jumpToPage.bind(this, '/micro-app/angular14/material')}>控制子应用跳转material</Button>
        <Button type="primary" onClick={jumpToPage.bind(this, '/micro-app/angular14/page3')}>控制子应用跳转page3</Button>
      </Col>
      {
        showLoading && <Spin indicator={antIcon} />
      }
      <micro-app
        name='angular14'
        url={`${config.angular14}micro-app/angular14`}
        data={data}
        onMounted={() => hideLoading(false)}
        // baseRoute='/micro-app/demo/angular14'
        // destroy
        // inline
        // disableScopecss
        // keep-alive
        // esmodule
        // iframe
      >
      </micro-app>
    </div>
  )
}

export default Angular14
