let BIFR = {}; // 存储预约配置

// 等待元素出现并执行回调函数
function waitForElements(selectors, callback) {
  const observer = new MutationObserver((mutations) => {
    if (selectors.every(selector => document.querySelector(selector))) {
      callback(); // 所有元素加载时执行回调
      observer.disconnect(); // 停止观察
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 提交第2步的表单，直到元素加载完成
function submitStep2Form(BIFR_date) {
  if (isPaused() === 'paused') {
    return;
  }

  const dateStr = new Date(BIFR_date).toString();

  // 等待 input#date 和 form#step2-form 元素加载
  waitForElements(['input#date', 'form#step2-form'], () => {
    const input = document.querySelector('input#date');
    const form = document.querySelector('form#step2-form');
    if (input) {
      input.value = dateStr;
      console.log(`[submitStep2Form] 填入日期: ${dateStr}`);
    }
    if (form) {
      console.log('[submitStep2Form] 提交表单');
      form.submit();
    }
  });
}

// 选择时间的操作
function selectTimeSlot() {
  const timeCells = document.querySelectorAll('.time-cell'); // 获取所有时间块
  const seatPriority = ['A席', 'B席', 'C席', 'D席']; // 座位选择优先级

  let foundAvailableTime = false; // 标记是否找到可用时间

  // 按优先级检查每个座位类型
  seatPriority.forEach((seatType) => {
    if (foundAvailableTime) return; // 如果已经找到一个可用的时间，跳出循环

    timeCells.forEach((cell) => {
      const seatTypeText = cell.querySelector('.seattypetext.level-left');
      const availableLink = cell.querySelector('a.level.post-link'); // 查找可用时间的链接

      if (seatTypeText && seatTypeText.textContent.includes(seatType) && availableLink) {
        console.log(`[Bot] 找到可用时间：${seatType} - ${availableLink.textContent}`);
        availableLink.click(); // 点击可用时间，进入下一页面
        foundAvailableTime = true;
        //return; // 找到第一个符合条件的就停止
      }
    });
  });

  if (!foundAvailableTime) {
    console.log('[Bot] 没有找到可用的时间');
  }
}

// 选择人数操作
function selectSeatNumber() {
  const selectElement = document.querySelector('select[name="guest"]');
  if (!selectElement) {
    console.log('[Bot] 没有找到人数选择框');
    return;
  }

  const selectedOption = selectElement.querySelector('option[selected="selected"]');

  if (selectedOption && selectedOption.value !== "0") {
    console.log('[Bot] 已手动选择人数:', selectedOption.textContent);
    selectElement.form.submit();
    return; // 已选择人数，跳过人数选择
  }

  // 如果未选择人数，则根据配置选择
  const seatNum = BIFR['SEAT_NUM'];
  console.log(`[Bot] 选择人数: ${seatNum} 名`);
  selectElement.value = seatNum;
  selectElement.dispatchEvent(new Event('change')); // 触发选择框的变更事件

  // 确保选择人数后，表单会被提交，进入下一个步骤
  selectElement.form.submit();
}

// 填充联系信息表单
function fillContactForm() {
  // 获取预设数据
  const name = BIFR['name'];
  const nameKana = BIFR['name'];
  const phone = BIFR['phone'];
  const email = BIFR['email'];
  console.log('[Debug] 读取的 BIFR 值:', BIFR);


// 填充姓名1
  const nameInput = document.querySelector('input[name="name"]');
  if (nameInput) {
    nameInput.value = name;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`[Bot] 填入姓名1: ${name}`);
  }
// 填充姓名2
const nameKanaInput = document.querySelector('input[name="name_kana"]');
if (nameKanaInput) {
  nameKanaInput.value = nameKana;
  nameKanaInput.dispatchEvent(new Event('input', { bubbles: true }));
  console.log(`[Bot] 填入姓名2: ${nameKana}`);
}

  // 填充电话
  const phoneInput = document.querySelector('input[name="phone_number"]');
  if (phoneInput) {
    phoneInput.value = phone;
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`[Bot] 填入电话: ${phone}`);
  }

  // 填充电子邮件
  const emailInput = document.querySelector('input[name="email"]');
  if (emailInput) {
    emailInput.value = email;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`[Bot] 填入邮箱: ${email}`);
  }

}


// 判断是否处于日本时间17:59到18:00之间，如果是则延迟执行
function waitUntilJapan1800(callback) {
  // 获取当前日本标准时间
  const now = new Date();
  const japanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

  const hours = japanTime.getHours();
  const minutes = japanTime.getMinutes();
  const seconds = japanTime.getSeconds();

  // 如果在 17:59:00 ~ 17:59:59.999 之间，则等待到18:00:00再执行
  if (hours === 17 && minutes === 59) {
    const msUntil1800 =
        (60 - seconds) * 1000 - japanTime.getMilliseconds();
    console.log(`[Bot] 当前为日本时间 ${hours}:${minutes}:${seconds}，将在 ${msUntil1800} 毫秒后（18:00 JST）自动开始`);
    setTimeout(callback, msUntil1800);
  } else {
    // 否则立即执行
    callback();
  }
}

// 主要执行函数
function main() {
  chrome.storage.local.get('reservationConfig', (result) => {
    if (result.reservationConfig) {
      BIFR = result.reservationConfig; //指定BIFR：basic information for reservation，从插件中获取预存变量。

      console.log('已读取设定：', BIFR);
      STATUS_SELECTORS = [
        {
          text: '自动勾选"同意する / Agree to terms"',
          selector: '#forms-agree > div > div > div.button-container > label'
        },
        {
          text: '自动勾选"同意して進む / (Go to the Reservation Page)" ）',
          selector: '#forms-agree > div > div > div.button-container-agree > button'
        },
        {
          text: '自动点击captcha verify 按鈕，请手动选择图片并确认，之后步骤将自动继续',
          selector: '#amzn-captcha-verify-button'
        },
        {
          text: '自动点击"予約へ進む(Make a Reservation)"',
          selector: 'body > div.container > div > div.column.is-8 > div > div.button-container > a'
        },
        {
          text: `自动填入 ${BIFR['SEAT_NUM']} 人`,
          selector: 'body > div.container > div > div.column.is-8 > div > div.field > form > div > select'
        },
        {text: '自动选择预约日期', selector: 'form#step2-form'},
        {text: '自动选择能预约的最近时间', selector: 'aaa'}, //优先按照ABCD席位排序，其次按照时间早晚排序，选择最近的一个。
        {text: '填写预存信息', selector: 'bbb'},
      ];
      createStatusUI();
      updateStatusUI();
      createToggleButton();

      if (isPaused()) {
        console.log('[Bot] 目前為暫停狀態，不執行自動操作');
        return;
      }

      tryClick('#forms-agree > div > div > div.button-container > label', '打勾同意');
      tryClick('#forms-agree > div > div > div.button-container-agree > button', '點選同意按鈕');
      tryClick('#amzn-captcha-verify-button', '按鈕captcha');
      tryClick('body > div.container > div > div.column.is-8 > div > div.button-container > a', '下一頁按鈕');
      selectSeatNumber(); // 选择预设人数
      submitStep2Form(BIFR['DATE']);  //选择预设时间
      selectTimeSlot(); // 选择时间并点击进入下一页
      fillContactForm(); //填充预置信息

    } else {
      console.warn('尚未設定參數');
      STATUS_SELECTORS = [
        {text: '请先点击插件，设置预约信息\n' + 'Please click on the plug-in to set the basic information'},
    ];
      createStatusUI(true);
    }
  });
}

// 检查是否处于暂停状态
function isPaused() {
  return localStorage.getItem('__pokemon_cafe_toggle_state__') !== 'running';
}

// 点击操作
function tryClick(selector, actionText) {
  if (isPaused() === 'paused') {
    return;
  }

  const el = document.querySelector(selector);

  if (el) {
    console.log(`[Bot] 執行: ${actionText}`);
    el.click();
  } else {
    console.log(`[Bot] 尚未找到: ${actionText}`);
  }
}


// 创建状态 UI
function createStatusUI(isAlarm = false) {
  if (document.getElementById('__pokemon_cafe_status_container__')) return;

  const container = document.createElement('div');
  container.id = '__pokemon_cafe_status_container__';
  container.style.position = 'fixed';
  container.style.bottom = '80px';
  container.style.right = '20px';
  container.style.backgroundColor = '#f1f1f1';
  container.style.border = `1px solid ${isAlarm ? '#ff0000' : '#999'}`;
  container.style.padding = '10px';
  container.style.zIndex = '9999';
  container.style.borderRadius = '5px';
  container.style.fontSize = '12px';
  container.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

  STATUS_SELECTORS.forEach((s, idx) => {
    const div = document.createElement('div');
    div.innerText = s.text;
    div.dataset.selector = s.selector;
    div.id = `status-step-${idx}`;
    div.style.marginBottom = '4px';
    div.style.color = isAlarm ? '#ff0000' : '';
    container.appendChild(div);
  });

  document.body.appendChild(container);
}



/*
function createStatusUI() {
  if (document.getElementById('__pokemon_cafe_status_container__')) return;

  const container = document.createElement('div');
  container.id = '__pokemon_cafe_status_container__';
  container.style.position = 'fixed';
  container.style.bottom = '80px';
  container.style.right = '20px';
  container.style.backgroundColor = '#f1f1f1';
  container.style.border = '1px solid #999';
  container.style.padding = '10px';
  container.style.zIndex = '9999';
  container.style.borderRadius = '5px';
  container.style.fontSize = '12px';
  container.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

  STATUS_SELECTORS.forEach((s, idx) => {
    const div = document.createElement('div');
    div.innerText = s.text;
    div.dataset.selector = s.selector;
    div.id = `status-step-${idx}`;
    div.style.marginBottom = '4px';
    container.appendChild(div);
  });

  document.body.appendChild(container);
}
*/
// 更新状态 UI
function updateStatusUI() {
  STATUS_SELECTORS.forEach((s, idx) => {
    if (!s) {
      return;
    }
    const el = document.querySelector(s.selector);
    const div = document.getElementById(`status-step-${idx}`);
    if (div) {
      if (el) {
        div.style.backgroundColor = '#a2f0a2'; // 成功
      } else {
        div.style.backgroundColor = ''; // 未找到
      }
    }
  });
}

// 创建切换按钮
function createToggleButton() {
  const btn = document.createElement('button');
  btn.innerText = isPaused() ? '▶️ 開始' : '⏸️ 暫停';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.padding = '10px 16px';
  btn.style.backgroundColor = '#007bff';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.fontSize = '14px';
  btn.style.zIndex = '10000';
  btn.style.cursor = 'pointer';
  btn.onclick = () => {
    const now = isPaused();
    const newState = now ? 'running' : 'paused';
    localStorage.setItem('__pokemon_cafe_toggle_state__', newState);
    btn.innerText = newState === 'running' ? '⏸️ 暫停' : '▶️ 開始';
    handleExecutionStateChange();
  };
  document.body.appendChild(btn);
}
/*
function createAlarmUI() {
  if (document.getElementById('__pokemon_cafe_status_container__')) return;

  const container = document.createElement('div');
  container.id = '__pokemon_cafe_status_container__';
  container.style.position = 'fixed';
  container.style.bottom = '80px';
  container.style.right = '20px';
  container.style.backgroundColor = '#f1f1f1';
  container.style.border = '1px solid #ff0000';
  container.style.padding = '10px';
  container.style.zIndex = '9999';
  container.style.borderRadius = '5px';
  container.style.fontSize = '12px';
  container.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

  STATUS_SELECTORS.forEach((s, idx) => {
    const div = document.createElement('div');
    div.innerText = s.text;
    div.dataset.selector = s.selector;
    div.id = `AlarmText`;
    div.style.marginBottom = '4px';
    div.style.color  = '#ff0000';
    container.appendChild(div);
  });

  document.body.appendChild(container);
}
*/

// 切换执行状态
function handleExecutionStateChange() {
  if (isPaused()) {
    console.log('[Bot] 切換為暫停狀態');
  } else {
    console.log('[Bot] 切換為執行狀態');
    main(); // 初始先執行一次
  }
}

// 页面加载完成后执行
/*
if (document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main);
}
*/
if (document.readyState === 'complete') {
  waitUntilJapan1800(main);
} else {
  window.addEventListener('load', () => waitUntilJapan1800(main));
}