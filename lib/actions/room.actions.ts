'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';
import { Document, Packer, Paragraph } from 'docx'; 
import jsPDF from 'jspdf';
// import { withLexicalDocument } from '@liveblocks/node-lexical';
// import { Node } from 'lexical';

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();
    
    try {
      const metadata = {
        creatorId: userId,
        email,
        title: 'Untitled'
      }
  
      const usersAccesses: RoomAccesses = {
        [email]: ['room:write']
      }
  
      const room = await liveblocks.createRoom(roomId, {
        metadata,
        usersAccesses,
        defaultAccesses: []
      });
      
      revalidatePath('/');
  
      return parseStringify(room);
    } catch (error) {
      console.log(`Error happened while creating a room: ${error}`);
    }
}

// export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
//   try {
//     const room = await liveblocks.getRoom(roomId);

//     const hasAccess = Object.keys(room.usersAccesses).includes(userId);
//     if (!hasAccess) {
//       throw new Error('You do not have access to this document');
//     }

//     // Use withLexicalDocument with a callback to retrieve the Lexical editor state
//     const lexicalContent = await withLexicalDocument(room, (editorState) => {
//       // This callback function is called with the editor state
//       // You can return the content in the format you need here
//       return editorState.read(() => {
//         const root = editorState._nodeMap.get('root') as Node;
//         return root ? root.toJSON() : null;
//       });
//     });

//     if (!lexicalContent) {
//       throw new Error('No content found in the document');
//     }

//     return JSON.stringify(lexicalContent);
//   } catch (error) {
//     console.log(`Error happened while getting a room: ${error}`);
//     throw error; // re-throw the error to handle it properly in calling functions
//   }
// };

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
  try {
      const room = await liveblocks.getRoom(roomId);
    
      const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    
      if(!hasAccess) {
        throw new Error('You do not have access to this document');
      }
    
      return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`);
  }
}


export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title
      }
    })

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while updating a room: ${error}`);
  }
}

export const getDocuments = async (email: string ) => {
  try {
      const rooms = await liveblocks.getRooms({ userId: email });
    
      return parseStringify(rooms);
  } catch (error) {
    console.log(`Error happened while getting rooms: ${error}`);
  }
}

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    }

    const room = await liveblocks.updateRoom(roomId, { 
      usersAccesses
    })

    if(room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email
        },
        roomId
      })
    }

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`);
  }
}

export const removeCollaborator = async ({ roomId, email }: {roomId: string, email: string}) => {
  try {
    const room = await liveblocks.getRoom(roomId)

    if(room.metadata.email === email) {
      throw new Error('You cannot remove yourself from the document');
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null
      }
    })

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`);
  }
}

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath('/');
    redirect('/');
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
}

export const exportAsPDF = async (roomId: string, userId: string): Promise<Blob> => {
  try {
    const document = await getDocument({ roomId, userId });
    if (!document) {
      throw new Error('Document could not be retrieved');
    }
  
    const pdf = new jsPDF();
    pdf.text(document.content, 10, 10);
    const pdfBlob = pdf.output('blob');
    
    return pdfBlob;
  } catch (error) {
    console.error('Failed to export as PDF:', error);
    throw error;
  }
};

export const exportAsDOCX = async (roomId: string, userId: string): Promise<Blob> => {
  try {
    const document = await getDocument({ roomId, userId });
    if (!document) {
      throw new Error('Document could not be retrieved');
    }
    
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph(document.content),
          ],
        },
      ],
    });

    const docxBlob = await Packer.toBlob(doc);
    return docxBlob;
  } catch (error) {
    console.error('Failed to export as DOCX:', error);
    throw error;
  }
};

export const exportAsHTML = async (roomId: string, userId: string): Promise<string> => {
  try {
    const document = await getDocument({ roomId, userId });
    if (!document) {
      throw new Error('Document could not be retrieved');
    }
    
    const htmlString = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <div>${document.content}</div>
      </body>
      </html>
    `;
    
    return htmlString;
  } catch (error) {
    console.error('Failed to export as HTML:', error);
    throw error;
  }
};