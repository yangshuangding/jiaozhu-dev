<template>
  <div class='page2'>
    <img src="../assets/micro-app-logo.jpeg" alt="" width="100" />
    <div class="test-btn" @click='onClickTest'>
      返回首页
    </div>
    <!-- <img src="../assets/logo.png" alt=""/> -->
    <h1>表单</h1>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="Activity name" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Activity zone" prop="region">
        <el-select v-model="ruleForm.region" placeholder="Activity zone" :popper-append-to-body="false">
          <el-option label="Zone one" value="shanghai"></el-option>
          <el-option label="Zone two" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              v-model="ruleForm.date1"
              type="date"
              placeholder="Pick a date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              v-model="ruleForm.date2"
              placeholder="Pick a time"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="Activity type" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="Online activities" name="type"></el-checkbox>
          <el-checkbox label="Promotion activities" name="type"></el-checkbox>
          <el-checkbox label="Offline activities" name="type"></el-checkbox>
          <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="Sponsorship"></el-radio>
          <el-radio label="Venue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >Create</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        <el-button ref="buttonRef" v-click-outside="onClickOutside">el-popover</el-button>
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          title="With title"
          virtual-triggering
        >
          <span> Some content </span>
        </el-popover>
      </el-form-item>
    </el-form>
    <br />
    <br />
    <h1>文字提示</h1>
    <div class="tooltip-base-box">
      <div class="row center">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Top Left prompts info"
          placement="top-start"
        >
          <el-button>top-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Top Center prompts info"
          placement="top"
        >
          <el-button>top</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Top Right prompts info"
          placement="top-end"
        >
          <el-button>top-end</el-button>
        </el-tooltip>
      </div>
      <div class="row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Left Top prompts info"
          placement="left-start"
        >
          <el-button>left-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Right Top prompts info"
          placement="right-start"
        >
          <el-button>right-start</el-button>
        </el-tooltip>
      </div>
      <div class="row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Left Center prompts info"
          placement="left"
        >
          <el-button class="mt-3 mb-3">left</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Right Center prompts info"
          placement="right"
        >
          <el-button>right</el-button>
        </el-tooltip>
      </div>
      <div class="row">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Left Bottom prompts info"
          placement="left-end"
        >
          <el-button>left-end</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Right Bottom prompts info"
          placement="right-end"
        >
          <el-button>right-end</el-button>
        </el-tooltip>
      </div>
      <div class="row center">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Bottom Left prompts info"
          placement="bottom-start"
        >
          <el-button>bottom-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Bottom Center prompts info"
          placement="bottom"
        >
          <el-button>bottom</el-button>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="Bottom Right prompts info"
          placement="bottom-end"
        >
          <el-button>bottom-end</el-button>
        </el-tooltip>
      </div>
    </div>
    <br />
    <br />
    <h1>弹出框</h1>
    <div>
      <el-popover
        placement="top-start"
        title="Title"
        :width="200"
        trigger="hover"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button>Hover to activate</el-button>
        </template>
      </el-popover>

      <el-popover
        placement="bottom"
        title="Title"
        :width="200"
        trigger="click"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button>Click to activate</el-button>
        </template>
      </el-popover>

      <el-popover
        ref="popover"
        placement="right"
        title="Title"
        :width="200"
        trigger="focus"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button>Focus to activate</el-button>
        </template>
      </el-popover>

      <el-popover
        ref="popover"
        title="Title"
        :width="200"
        trigger="contextmenu"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button>contextmenu to activate</el-button>
        </template>
      </el-popover>

      <el-popover
        v-model="popoverVisible"
        placement="bottom"
        title="Title"
        :width="200"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-button @click="popoverVisible = !popoverVisible">Manual to activate</el-button>
        </template>
      </el-popover>

      <el-popconfirm title="Are you sure to delete this?">
        <template #reference>
          <el-button>Delete</el-button>
        </template>
      </el-popconfirm>
    </div>
    <br />
    <br />
    <h1>通知</h1>
    <div>
      <el-button plain @click="noticeOpen1"> Success </el-button>
      <el-button plain @click="noticeOpen2"> Warning </el-button>
      <el-button plain @click="noticeOpen3"> Info </el-button>
      <el-button plain @click="noticeOpen4"> Error </el-button>
    </div>
    <br />
    <br />
    <h1>消息提示</h1>
    <div>
      <el-button :plain="true" @click="messageOpen1">message</el-button>
      <el-button :plain="true" @click="messageOpen2">success</el-button>
      <el-button :plain="true" @click="messageOpen3">warning</el-button>
      <el-button :plain="true" @click="messageOpen4">error</el-button>
    </div>
    <br />
    <br />
    <h1>对话框</h1>
    <div>
      <el-button text @click="dialogVisible = true"
        >click to open the Dialog</el-button
      >
      <el-button text @click="openMessageBox">Click to open Message Box</el-button>

      <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="30%"
        :before-close="handleDialogClose"
      >
        <span>This is a message</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >Confirm</el-button
            >
          </span>
        </template>
      </el-dialog>

    </div>
    <br />
    <br />
    <h1>抽屉</h1>
    <div>
      <el-button type="primary" @click="drawer = true">
        open
      </el-button>

      <el-drawer v-model="drawer" title="I'm outer Drawer" size="50%">
        <div>
          <el-button @click="innerDrawer = true">Click me!</el-button>
          <el-drawer
            v-model="innerDrawer"
            title="I'm inner Drawer"
            :append-to-body="true"
            :before-close="handleDrawerClose"
          >
            <p>_(:зゝ∠)_</p>
          </el-drawer>
        </div>
      </el-drawer>
    </div>
    <br />
    <br />
    <h1>菜单</h1>
    <div class="flex flex-wrap items-center">
      <el-dropdown>
        <el-button type="primary">
          Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown split-button type="primary" @click="handleDropDownClick">
        Dropdown List
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-menu
        :default-active="activeMenuIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleMenuSelect"
      >
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="3" disabled>Info</el-menu-item>
        <el-menu-item index="4">Orders</el-menu-item>
      </el-menu>
    </div>
    <br />
    <br />
    <h1>取色器</h1>
    <div class="demo-color-block">
      <span class="demonstration">With default value</span>
      <el-color-picker v-model="color1" />
    </div>
    <br />
    <br />
    <h1>走马灯</h1>
    <div>
      <el-carousel indicator-position="outside">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 text="2xl" justify="center">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
    <br />
    <br />
    <h1>分页</h1>
    <div>
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
    <br />
    <br />
    <h1>无限滚动</h1>
    <div>
      <ul v-infinite-scroll="infiniteScrollload" class="infinite-list" style="overflow: auto">
        <li v-for="i in infiniteScrollCount" :key="i" class="infinite-list-item">{{ i }}</li>
      </ul>
    </div>
    <br />
    <br />
    <h1>骨架屏</h1>
    <div>
      <el-skeleton />
      <br />
      <el-skeleton style="--el-skeleton-circle-size: 100px">
        <template #template>
          <el-skeleton-item variant="circle" />
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, unref } from 'vue'
// More info see https://github.com/element-plus/element-plus/blob/dev/docs/examples/form/utils.ts
import { resetForm, submitForm } from '/src/utils'
import { ClickOutside as vClickOutside, ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const popoverVisible = ref(false)

const router = useRouter()
const onClickTest = () => {
  router.push('/')
  // console.log(router)
}

const formSize = ref('')

const ruleFormRef = ref()
const ruleForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const rules = reactive({
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 5,
      message: 'Length should be 3 to 5',
      trigger: 'blur',
    },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    {
      required: true,
      message: 'Please input activity form',
      trigger: 'blur',
    },
  ],
})

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

const noticeOpen1 = () => {
  ElNotification({
    title: 'Success',
    message: 'This is a success message',
    type: 'success',
  })
}

const noticeOpen2 = () => {
  ElNotification({
    title: 'Warning',
    message: 'This is a warning message',
    type: 'warning',
  })
}

const noticeOpen3 = () => {
  ElNotification({
    title: 'Info',
    message: 'This is an info message',
    type: 'info',
  })
}

const noticeOpen4 = () => {
  ElNotification({
    title: 'Error',
    message: 'This is an error message',
    type: 'error',
  })
}

const messageOpen1 = () => {
  ElMessage('this is a message.')
}
const messageOpen2 = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}
const messageOpen3 = () => {
  ElMessage({
    message: 'Warning, this is a warning message.',
    type: 'warning',
  })
}
const messageOpen4 = () => {
  ElMessage.error('Oops, this is a error message.')
}

const dialogVisible = ref(false)

const handleDialogClose = (done) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const openMessageBox = () => {
  ElMessageBox.prompt('Please input your e-mail', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

const drawer = ref(false)
const innerDrawer = ref(false)

const handleDrawerClose = (done) => {
  ElMessageBox.confirm('You still have unsaved data, proceed?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const handleDropDownClick = () => {
  // eslint-disable-next-line no-alert
  alert('button click')
}

const activeMenuIndex = ref('1')

const handleMenuSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

const color1 = ref('#409EFF')

// const getTreeV2Key = (prefix, id) => {
//   return `${prefix}-${id}`
// }

// const createTreeV2Data = (
//   maxDeep,
//   maxChildren,
//   minNodesNumber,
//   deep = 1,
//   key = 'node'
// ) => {
//   let id = 0
//   return Array.from({ length: minNodesNumber })
//     .fill(deep)
//     .map(() => {
//       const childrenNumber =
//         deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
//       const nodeKey = getTreeV2Key(key, ++id)
//       return {
//         id: nodeKey,
//         label: nodeKey,
//         children: childrenNumber
//           ? createTreeV2Data(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
//           : undefined,
//       }
//     })
// }

// const treeV2Data = createTreeV2Data(4, 30, 40)

const infiniteScrollCount = ref(0)
const infiniteScrollload = () => {
  infiniteScrollCount.value += 2
}
</script>

<style scoped>
  .page2 {
    width: 50vw;
    margin: 0 auto;
    background: #fff;
    padding: 40px;
  }

  .test-btn {
    height: 40px;
    width: 100px;
    background-color: red;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 20px;
  }
  .tooltip-base-box {
    width: 600px;
  }
  .tooltip-base-box .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tooltip-base-box .center {
    justify-content: center;
  }
  .tooltip-base-box .box-item {
    width: 110px;
    margin-top: 10px;
  }

  .dialog-footer button:first-child {
    margin-right: 10px;
  }

  .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }

  .el-carousel__item h3 {
    display: flex;
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }
  .infinite-list .infinite-list-item + .list-item {
    margin-top: 10px;
  }
</style>
