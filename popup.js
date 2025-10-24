
// 明天的預設日期格式
function getDefaultDate() {
  const FurtherDate = new Date();
  FurtherDate.setDate(FurtherDate.getDate() + 31);
  return FurtherDate.toISOString().split('T')[0]; // yyyy-mm-dd
}
// 把开始处的 '+' 替换为 '00'，并返回新的字符串。
// 如果你希望替换所有 '+'，把 replace 的第二个参数改为 '00' 并使用 /\\+/g
function convertPlusTo00(str) {
  if (!str || typeof str !== 'string') return str || '';
  return str.replace(/^\+/g, '00');   // 只把开头的 '+' 替换为 '00'（如果需要替换所有 '+' 可改为 str.replace(/\+/g, '00')）
}

document.addEventListener('DOMContentLoaded', () => {
  
  const form = document.getElementById('reservationForm');
  const clearBtn = document.getElementById('clearBtn');

  chrome.storage.local.get('reservationConfig', (result) => {
    const config = result.reservationConfig || {};

    document.getElementById('seatNum').value = config.SEAT_NUM || 3;
    document.getElementById('date').value = config.DATE || getDefaultDate();
    document.getElementById('name').value = config.name || 'Zhang San';
    document.getElementById('phone').value = config.phone || '8613000000000';
    document.getElementById('email').value = config.email || 'youremail@gmail.com';
  });

  // 儲存按鈕行為
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const config = {
      SEAT_NUM: parseInt(document.getElementById('seatNum').value),
      DATE: document.getElementById('date').value,
      name: document.getElementById('name').value,
      //phoneRaw: document.getElementById('phone').value,
      phone:convertPlusTo00(document.getElementById('phone').value),
      email: document.getElementById('email').value

    };

    chrome.storage.local.set({ reservationConfig: config }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
      console.log('已保存！');
    });
  });

  // 一鍵清除按鈕行為
  clearBtn.addEventListener('click', () => {
    // 清空所有欄位值
    console.log("clean all fields");
    document.getElementById('seatNum').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
  
    // 重設日期為明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    document.getElementById('date').value = `${yyyy}-${mm}-${dd}`;
  
    // 清除儲存在 chrome.storage 的資料
    chrome.storage.local.remove('reservationConfig', () => {
      console.log('信息已重置/All info Reset');
    });
  });
  
});
