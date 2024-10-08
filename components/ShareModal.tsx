"use client";

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import NotRegisteredModal from "./NotRegisteredModal";
import { getClerkUserByEmail } from "@/lib/actions/user.actions";

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");
  const [isNotRegisteredModalOpen, setNotRegisteredModalOpen] = useState(false);

  const shareDocumentHandler = async () => {
    setLoading(true);
    const result = await getClerkUserByEmail(email);

    if (result && result.userExists) {
      await updateDocumentAccess({
        roomId,
        email: result.email,
        userType: userType as UserType,
        updatedBy: user.info,
      });

      setLoading(false);
      setOpen(false);
    } else {
      setLoading(false);
      setNotRegisteredModalOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger disabled={currentUserType !== 'editor'}>
          <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== 'editor'}>
            <Image
              src='/assets/icons/share.svg'
              alt="Share"
              width={20}
              height={20}
              className="min-w-4 md:size-5"
            />
            <p className="mr-1 hidden sm:block">Share</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog">
          <DialogHeader>
            <DialogTitle>Manage who can view this project</DialogTitle>
            <DialogDescription>
              Select which users can view or edit this document
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="email" className="mt-6 text-blue-300">
            Email address
          </Label>
          <div className="flex items-center gap-3">
            <div className="share-input-wrapper">
              <Input
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="share-input"
              />
              <UserTypeSelector userType={userType} setUserType={setUserType} />
            </div>
            <Button type='submit' onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={loading}>
              {loading ? 'Sending...' : 'Invite'}
            </Button>
          </div>

          <div className="my-2 space-y-2">
            <ul className="flex flex-col">
              {collaborators.map((collaborator) => {
                return (
                  <Collaborator
                    key={collaborator.id}
                    roomId={roomId}
                    creatorId={creatorId}
                    email={collaborator.email}
                    collaborator={collaborator}
                    user={user.info}
                  />
                )
              })}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <NotRegisteredModal
        isOpen={isNotRegisteredModalOpen}
        onClose={() => setNotRegisteredModalOpen(false)}
        email={email}
      />
    </>
  );
};

export default ShareModal;
