// import AddDocumentBtn from '@/components/AddDocumentBtc';
// import { DeleteModal } from '@/components/DeleteModal';
// import Header from '@/components/Header'
// import Notifications from '@/components/Notifications';
// import { getDocuments } from '@/lib/actions/room.actions';
// import { dateConverter } from '@/lib/utils';
// import { SignedIn, UserButton } from '@clerk/nextjs'
// import { currentUser } from '@clerk/nextjs/server';
// import Image from 'next/image';
// import Link from 'next/link';
// import { redirect } from 'next/navigation';

// const Home = async () => {
//   const clerkUser = await currentUser()
//   if(!clerkUser) redirect("/sign-in")

//   const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress)

//   return (
//     <main className='home-container'>
//       <Header className='sticky left-0 top-0'>
//         <div className='flex items-center gap-2 lg:gap-4'>
//           <Notifications />
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </Header>

//       {roomDocuments.data.length > 0 ? (
//         <div className='document-list-container'>
//           <div className='document-list-title'>
//             <h3 className='text-28-semibold'>All documents</h3>
//             <AddDocumentBtn 
//               userId={clerkUser.id}
//               email={clerkUser.emailAddresses[0].emailAddress}
//             />
//           </div>

//           <ul className="document-ul">
//             {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
//               <li key={id} className="document-list-item">
//                 <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
//                   <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
//                     <Image 
//                       src="/assets/icons/doc.svg"
//                       alt="file"
//                       width={40}
//                       height={40}
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <p className="line-clamp-1 text-lg">{metadata.title}</p>
//                     <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
//                   </div>
//                 </Link>
//                 <DeleteModal roomId={id}/>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ): (
//         <div className="document-list-empty">
//           <Image 
//             src="/assets/icons/doc.svg"
//             alt="Document"
//             width={40}
//             height={40}
//             className="mx-auto"
//           />

//           <AddDocumentBtn 
//             userId={clerkUser.id}
//             email={clerkUser.emailAddresses[0].emailAddress}
//           />
//         </div>
//       )}
//     </main>
//   )
// }

// export default Home

import AddDocumentBtn from '@/components/AddDocumentBtc';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import SelectViewType from '@/components/SelectViewType';
import { Card } from '@/components/ui/card';
import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Home = async ({ searchParams }: { searchParams: { view?: string } }) => {
  const view = searchParams.view || 'list';

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className='home-container'>
      <Header className='sticky left-0 top-0'>
        <div className='flex items-center gap-2 lg:gap-4'>
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {roomDocuments.data.length > 0 ? (
        <div className='document-list-container'>
          <div className='document-list-title'>
            <h3 className='text-28-semibold'>All documents</h3>
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>

          {/* View Toggle */}
          <div className="flex justify-end mb-4">
            <SelectViewType currentView={view} />
          </div>

          {/* Document List */}
          {view === 'list' ? (
            <ul className="document-ul">
              {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
                <li key={id} className="document-list-item">
                  <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                    <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100">Created about {dateConverter(createdAt)}</p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
                <Card key={id} className="p-4">
                  <Link href={`/documents/${id}`} className="block">
                    <div className="space-y-2">
                      <Image
                        src="/assets/icons/doc.svg"
                        alt="file"
                        width={40}
                        height={40}
                        className="mx-auto"
                      />
                      <h4 className="text-lg font-semibold text-center">{metadata.title}</h4>
                      <p className="text-sm text-center text-blue-100">Created about {dateConverter(createdAt)}</p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="Document"
            width={40}
            height={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
}

export default Home;
