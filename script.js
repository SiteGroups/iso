// 导入语言数据
import languageData from './languageData.js';
import languageCodes from './languageCodes.js';

// 全局变量
let currentLang = 'zh-CN';

// DOM元素
let languageCards, searchInput, description, noResults, currentLanguageText, languageToggle, languageDropdown;

// 初始化应用
async function initApp() {
  try {
    // 获取DOM元素
    languageCards = document.getElementById('languageCards');
    searchInput = document.getElementById('searchInput');
    description = document.getElementById('description');
    noResults = document.getElementById('noResults');
    currentLanguageText = document.getElementById('currentLanguage');
    languageToggle = document.getElementById('languageToggle');
    languageDropdown = document.getElementById('languageDropdown');

    // 显示加载状态
    languageCards.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
        <p>加载中...</p>
      </div>
    `;
    

    
    // 从localStorage获取语言偏好
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && languageData[savedLang]) {
      currentLang = savedLang;
    }
    
    // 使用页面设置的默认语言
    currentLang = window.defaultLang || 'zh-CN';
    
    // 更新SEO元标签
    document.title = languageData[currentLang].metaTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', languageData[currentLang].metaDescription);
    document.querySelector('meta[name="keywords"]').setAttribute('content', languageData[currentLang].metaKeywords);
    document.querySelector('meta[property="og:title"]').setAttribute('content', languageData[currentLang].metaTitle);
    document.querySelector('meta[property="og:description"]').setAttribute('content', languageData[currentLang].metaDescription);

    // 设置HTML lang属性
    document.documentElement.lang = currentLang;
    
    // 渲染页面
    renderPage();
    
    // 绑定事件
    bindEvents();
    
  } catch (error) {
    console.error('加载数据失败:', error);
    languageCards.innerHTML = `
      <div class="col-span-full text-center py-8">
        <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
        <h3 class="text-xl font-medium mb-2">加载数据失败</h3>
        <p class="text-gray-500">加载失败: ${error.message}</p>
      </div>
    `;
  }
}

// 渲染页面
function renderPage() {
  // 更新页面文本
  description.textContent = languageData[currentLang].description;
  searchInput.placeholder = languageData[currentLang].searchPlaceholder;
  
  if (currentLang === 'zh-CN') {
    currentLanguageText.textContent = '中文'
  }

  if (currentLang === 'en-US') {
    currentLanguageText.textContent = 'English'
  }
  
  if (currentLang === 'th-TH') {
    currentLanguageText.textContent = 'ไทย'
  }

  if (currentLang === 'id-ID') {
    currentLanguageText.textContent = 'Indonesia'
  }
  // 执行搜索
  performSearch();
}

// 执行搜索
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredCodes = searchTerm 
    ? languageCodes.filter(code => 
        code.code.toLowerCase().includes(searchTerm)
      )
    : languageCodes;
  
  // 显示结果或无结果提示
  if (filteredCodes.length === 0) {
    languageCards.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    renderLanguageCards(filteredCodes);
  }
}

// 渲染语言卡片
function renderLanguageCards(codes) {
  
  languageCards.innerHTML = codes.map(code => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden smooth-transition hover:card-hover">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-dark">${currentLang === 'zh-CN' ? code.zh : currentLang === 'th-TH' ? code.th : currentLang === 'id-ID' ? code.id : code.en}</h3>
            <p class="text-sm text-gray-500 mt-1">${code.code}</p>
          </div>
          <div class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
            ISO 639
          </div>
        </div>
        
        <div class="flex justify-between text-sm text-gray-600">
          <span>${currentLang === 'zh-CN' ? '英文名称' : 'English Name'}</span>
          <span class="font-medium">${code.en}</span>
        </div>

        ${currentLang === 'zh-CN' ? `
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>中文名称</span>
          <span class="font-medium">${code.zh}</span>
        </div>
        ` : currentLang === 'th-TH' ? `
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>ชื่อภาษาไทย</span>
          <span class="font-medium">${code.th}</span>
        </div>
        ` : currentLang === 'id-ID' ? `
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>Nama Indonesia</span>
          <span class="font-medium">${code.id}</span>
        </div>
        `: ''}
      </div>
    </div>
  `).join('');
}

// 绑定事件处理程序
function bindEvents() {
  // 搜索输入事件
  searchInput.addEventListener('input', performSearch);
  
  // 语言切换下拉菜单
  languageToggle.addEventListener('click', () => {
    languageDropdown.classList.toggle('hidden');
  });
  
  // 点击页面其他地方关闭下拉菜单
  document.addEventListener('click', (e) => {
    if (!languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageDropdown.classList.add('hidden');
    }
  });
}

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);