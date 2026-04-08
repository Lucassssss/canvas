'use client'

import Script from 'next/script'

export function BaiduSEO() {
  return (
    <>
      <Script
        id="baidu-push"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  var bp = document.createElement('script');
  var curProtocol = window.location.protocol.split(':')[0];
  if (curProtocol === 'https') {
    bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
  } else {
    bp.src = 'http://push.zhanzhang.baidu.com/push.js';
  }
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(bp, s);
})();
          `,
        }}
      />
    </>
  )
}
