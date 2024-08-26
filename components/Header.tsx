import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const Header = ({children, className}: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      <Link href='/' className='md:flex-1 flex items-center'>
        <Image
          src='/assets/icons/logo-icon.svg'
          alt='logo' 
          width={32}
          height={32}
          className=''
        /> 
        <h3>LiveDocs</h3>
      </Link>
      {children}
    </div>
  )
}

export default Header