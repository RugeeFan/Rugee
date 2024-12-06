import React, { Fragment } from 'react'
import Icon from './common/Icon'

export default function Footer() {
  const socialLinks = [
    { name: 'GitHub', icon: 'github', href: 'https://github.com/RugeeFan' },
    { name: 'Facebook', icon: 'facebook', href: 'https://m.me/rugee0126' },
    { name: 'WhatsApp', icon: 'whatsapp', href: 'https://wa.me/61449963099' }
  ]

  return (
    <footer className="py-6 px-6 flex justify-between items-center border-t">
      <span className="text-secondary">© 2024 All rights reserved.</span>
      <div className="hidden md:flex items-center space-x-4">
        {socialLinks.map((link, index) => (
          <Fragment key={link.name}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-gray-600"
            >
              <span className="hidden md:inline">{link.name}</span>
              <Icon name={link.icon} className="md:hidden" />
            </a>
            {index < socialLinks.length - 1 && (
              <span className="text-primary">/</span>
            )}
          </Fragment>
        ))}
      </div>
    </footer>
  )
} 