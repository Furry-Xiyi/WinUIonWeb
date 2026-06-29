# CheckBox 完整示例 - 严格对齐官方

## CheckBox 示例1的代码

### Template Code
```vue
<WinCheckBox v-model="twoStateChecked" @checked="onTwoStateChecked" @unchecked="onTwoStateUnchecked">
  Two-state CheckBox
</WinCheckBox>
```

### Vue Code
```js
const twoStateChecked = ref(false);

const onTwoStateChecked = () => {
  console.log('CheckBox is checked');
};

const onTwoStateUnchecked = () => {
  console.log('CheckBox is unchecked');
};
```

## CheckBox 示例2的代码

### Template Code
```vue
<WinCheckBox
  v-model="threeStateValue"
  :isThreeState="true"
  @checked="onThreeStateChecked"
  @unchecked="onThreeStateUnchecked"
  @indeterminate="onThreeStateIndeterminate">
  Three-state CheckBox
</WinCheckBox>
```

### Vue Code
```js
const threeStateValue = ref(null);

const onThreeStateChecked = () => {
  console.log('CheckBox is checked');
};

const onThreeStateUnchecked = () => {
  console.log('CheckBox is unchecked');
};

const onThreeStateIndeterminate = () => {
  console.log('CheckBox is indeterminate');
};
```
