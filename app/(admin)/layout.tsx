import AdminNav from '@/app/_components/Adminnav'


const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
        <AdminNav/>
        {children}
    </div>
  )
}

export default layout