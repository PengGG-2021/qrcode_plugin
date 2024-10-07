function createQRCode() {
  const url = window.location.href;
  const title = document.title;
  const siteName = new URL(url).hostname;

  // 创建容器
  const container = document.createElement('div');
  container.id = 'qr-code-container';
  container.classList.add('collapsed'); // 默认添加collapsed类
  
  // 创建QR码容器
  const qrCodeContainer = document.createElement('div');
  qrCodeContainer.id = 'qr-code-wrapper';
  
  // 创建二维码图片
  const qrCode = document.createElement('img');
  qrCode.id = 'qr-code';
  qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;
  
  // 创建logo图片容器
  const logoContainer = document.createElement('div');
  logoContainer.id = 'logo-container';
  
  // 将QR码和logo容器添加到QR码包装器
  qrCodeContainer.appendChild(qrCode);
  qrCodeContainer.appendChild(logoContainer);
  
  // 创建网站名称元素
  const siteNameElement = document.createElement('div');
  siteNameElement.id = 'site-name';
  siteNameElement.textContent = siteName;
  
  // 创建网页标题元素
  const titleElement = document.createElement('div');
  titleElement.id = 'page-title';
  titleElement.textContent = title.length > 15 ? title.substring(0, 15) + '...' : title;
  
  // 将元素添加到容器中
  container.appendChild(qrCodeContainer);
  container.appendChild(siteNameElement);
  container.appendChild(titleElement);
  
  // 将容器添加到页面
  document.body.appendChild(container);
  
  // 获取网站logo
  getLogo((logoUrl) => {
    if (logoUrl) {
      addLogoToQRCode(logoContainer, logoUrl);
    }
  });

  // 添加点击事件监听器
  container.addEventListener('click', toggleQRCode);
}

function getLogo(callback) {
  // 尝试获取各种可能的logo源
  const possibleLogos = [
    document.querySelector('link[rel="icon"]'),
    document.querySelector('link[rel="shortcut icon"]'),
    document.querySelector('link[rel="apple-touch-icon"]'),
    document.querySelector('meta[property="og:image"]')
  ];

  for (let i = 0; i < possibleLogos.length; i++) {
    if (possibleLogos[i]) {
      const logoUrl = possibleLogos[i].href || possibleLogos[i].content;
      if (logoUrl) {
        callback(logoUrl);
        return;
      }
    }
  }

  // 如果上述方法都失败，尝试使用默认的favicon.ico
  const domain = new URL(window.location.href).hostname;
  const faviconUrl = `https://${domain}/favicon.ico`;
  callback(faviconUrl);
}

function addLogoToQRCode(logoContainer, logoUrl) {
  const logo = document.createElement('img');
  logo.id = 'qr-logo';
  logo.src = logoUrl;
  logo.onerror = function() {
    // 如果logo加载失败，移除logo容器
    logoContainer.remove();
  };
  logoContainer.appendChild(logo);
}

function toggleQRCode() {
  const container = document.getElementById('qr-code-container');
  container.classList.toggle('collapsed');
}

// 当页面加载完成时创建二维码
window.addEventListener('load', createQRCode);