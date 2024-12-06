import React from 'react'
import { AdvancedImage } from '@cloudinary/react'
import cld from '../config/cloudinary'

export default function Partners() {
  const partners = [
    { icon: 'js_aojuqx' },
    { icon: 'figma_vydwbk' },
    { icon: 'node_rhbbxz' },
    { icon: 'mongoDB_oybucc' },
    { icon: 'postgresql_tjshg2' },
    { icon: 'shopify_tdj4lh' },
    { icon: 'wordpress_oj0bb0' }
  ]

  return (
    <div className="relative w-full overflow-hidden">
      {/* 上方圆弧 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-section-bg rounded-b-[100%] -translate-y-16" />

      {/* 合作伙伴列表 */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative flex overflow-hidden items-center">
          {/* 无限滚动容器 */}
          <div className="flex animate-seamless-scroll py-8">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-12 w-32 lg:w-[12rem] grayscale opacity-100 transition-opacity hover:opacity-50 mx-4"
              >
                <AdvancedImage
                  cldImg={cld.image(partner.icon)}
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 下方圆弧 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-section-bg rounded-t-[100%] translate-y-16" />
    </div>
  )
}
