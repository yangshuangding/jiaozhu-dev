<template>
  <div class="ant-design-vue-con">
    <h1>日期选择器</h1>
    <a-space direction="vertical">
      <a-date-picker>
        <template #renderExtraFooter>extra footer</template>
      </a-date-picker>
      <a-date-picker show-time>
        <template #renderExtraFooter>extra footer</template>
      </a-date-picker>
      <a-range-picker>
        <template #renderExtraFooter>extra footer</template>
      </a-range-picker>
      <a-range-picker show-time>
        <template #renderExtraFooter>extra footer</template>
      </a-range-picker>
      <a-date-picker placeholder="Select month" picker="month">
        <template #renderExtraFooter>extra footer</template>
      </a-date-picker>
    </a-space>
    <br />
    <br />
    <h1>普通选择器</h1>
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">Large</a-radio-button>
      <a-radio-button value="middle">Middle</a-radio-button>
      <a-radio-button value="small">Small</a-radio-button>
    </a-radio-group>
    <br />
    <br />
    <a-space direction="vertical">
      <a-select
        v-model:value="value1"
        :size="size"
        style="width: 200px"
        :options="options"
      ></a-select>
      <a-select
        v-model:value="value2"
        :options="options"
        mode="multiple"
        :size="size"
        placeholder="Please select"
        style="width: 200px"
        @popupScroll="popupScroll"
      ></a-select>
      <a-select
        v-model:value="value3"
        :options="options"
        mode="tags"
        :size="size"
        placeholder="Please select"
        style="width: 200px"
      ></a-select>
    </a-space>
    <br />
    <br />
    <h1>滑块</h1>
    <a-slider id="test" v-model:value="sliderValue1" />
    <a-slider v-model:value="sliderValue2" range />
    <br />
    <br />
    <h1>Form</h1>
    <a-form
      :model="formState"
      name="validate_other"
      v-bind="formItemLayout"
      @finishFailed="onFinishFailed"
      @finish="onFinish"
    >
      <a-form-item label="Plain Text">
        <span class="ant-form-text">China</span>
      </a-form-item>
      <a-form-item
        name="select"
        label="Select"
        has-feedback
        :rules="[{ required: true, message: 'Please select your country!' }]"
      >
        <a-select v-model:value="formState.select" placeholder="Please select a country">
          <a-select-option value="china">China</a-select-option>
          <a-select-option value="usa">U.S.A</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        name="select-multiple"
        label="Select[multiple]"
        :rules="[{ required: true, message: 'Please select your favourite colors!', type: 'array' }]"
      >
        <a-select
          v-model:value="formState['select-multiple']"
          mode="multiple"
          placeholder="Please select favourite colors"
        >
          <a-select-option value="red">Red</a-select-option>
          <a-select-option value="green">Green</a-select-option>
          <a-select-option value="blue">Blue</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="InputNumber">
        <a-form-item name="input-number" no-style>
          <a-input-number v-model:value="formState['input-number']" :min="1" :max="10" />
        </a-form-item>
        <span class="ant-form-text">machines</span>
      </a-form-item>

      <a-form-item name="switch" label="Switch">
        <a-switch v-model:checked="formState.switch" />
      </a-form-item>

      <a-form-item name="slider" label="Slider">
        <a-slider
          v-model:value="formState.slider"
          :marks="{
            0: 'A',
            20: 'B',
            40: 'C',
            60: 'D',
            80: 'E',
            100: 'F',
          }"
        />
      </a-form-item>

      <a-form-item name="radio-group" label="Radio.Group">
        <a-radio-group v-model:value="formState['radio-group']">
          <a-radio value="a">item 1</a-radio>
          <a-radio value="b">item 2</a-radio>
          <a-radio value="c">item 3</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        name="radio-button"
        label="Radio.Button"
        :rules="[{ required: true, message: 'Please pick an item!' }]"
      >
        <a-radio-group v-model:value="formState['radio-button']">
          <a-radio-button value="a">item 1</a-radio-button>
          <a-radio-button value="b">item 2</a-radio-button>
          <a-radio-button value="c">item 3</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="checkbox-group" label="Checkbox.Group">
        <a-checkbox-group v-model:value="formState['checkbox-group']">
          <a-row>
            <a-col :span="8">
              <a-checkbox value="A" style="line-height: 32px">A</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="B" style="line-height: 32px" disabled>B</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="C" style="line-height: 32px">C</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="D" style="line-height: 32px">D</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="E" style="line-height: 32px">E</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="F" style="line-height: 32px">F</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item name="rate" label="Rate">
        <a-rate v-model:value="formState.rate" allow-half />
      </a-form-item>

      <a-form-item name="upload" label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
        <a-upload
          v-model:fileList="formState.upload"
          name="logo"
          action="/upload.do"
          list-type="picture"
        >
          <a-button>
            <template #icon><UploadOutlined /></template>
            Click to upload
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item label="Dragger">
        <a-form-item name="dragger" no-style>
          <a-upload-dragger v-model:fileList="formState.dragger" name="files" action="/upload.do">
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
            <p class="ant-upload-hint">Support for a single or bulk upload.</p>
          </a-upload-dragger>
        </a-form-item>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
    <br />
    <br />
    <h1>Modal</h1>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
    <br />
    <br />
    <h1>Popover</h1>
    <a-popover title="Title" trigger="hover">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Hover me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="focus">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Focus me</a-button>
    </a-popover>
    <a-popover title="Title" trigger="click">
      <template #content>
        <p>Content</p>
        <p>Content</p>
      </template>
      <a-button>Click me</a-button>
    </a-popover>
    <br />
  </div>
</template>
<script>
import { defineComponent, ref, reactive } from 'vue';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    UploadOutlined,
    InboxOutlined,
  },
  setup() {
    const visible = ref(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = e => {
      console.log(e);
      visible.value = false;
    };

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const formState = reactive({
      'input-number': 3,
      'checkbox-group': ['A', 'B'],
      rate: 3.5,
    });

    const onFinish = values => {
      console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    const popupScroll = () => {
      console.log('popupScroll');
    };

    const sliderValue1 = ref(0);
    const sliderValue2 = ref([20, 50]);
    const sliderDisabled = ref(false);

    return {
      visible,
      showModal,
      handleOk,
      formState,
      onFinish,
      onFinishFailed,
      formItemLayout,
      popupScroll,
      size: ref('middle'),
      value1: ref('a1'),
      value2: ref(['a1', 'b2']),
      value3: ref(['a1', 'b2']),
      options: [...Array(25)].map((_, i) => ({
        value: (i + 10).toString(36) + (i + 1),
      })),
      sliderValue1,
      sliderValue2,
    };
  },

});
</script>

<style>
.ant-design-vue-con {
    width: 50vw;
    margin: 0 auto;
    background: #fff;
    padding-top: 10px;
    padding-bottom: 10px;
    min-height: 40vw;
}

#components-popover-demo-triggerType .ant-btn {
  margin-right: 8px;
}

.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
