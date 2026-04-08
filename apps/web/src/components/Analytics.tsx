'use client'

import Script from 'next/script'

export function Analytics() {
  return (
    <>
      <Script
        id="la-collect"
        src="//sdk.51.la/js-sdk-pro.min.js"
        strategy="afterInteractive"
      />
      <Script
        id="la-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `LA.init({id:"3PYx1i4s1cVhLJE7",ck:"3PYx1i4s1cVhLJE7",autoTrack:true,hashMode:true,screenRecord:true})`,
        }}
      />
    </>
  )
}
