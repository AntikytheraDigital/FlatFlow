import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/router";
import { createTRPCClient } from '@trpc/client';
import { TRPCError } from '@trpc/server';
import { LoadingSpinner } from '@/components/loading';
import { api } from "@/utils/api";

type InputFieldProps = ButtonProps;

const CreateFlat = () => {
  const { user } = useUser();
  const [flatName, setFlatName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter(); 

  const { mutate, isLoading: isCreating } =
    api.flat.createFlatWithName.useMutation({
      onSuccess: (flat) => {
        setSuccessMessage(`Successfully created flat: ${flat.id}`);
        setFlatName("");
        router.push(`/flat/${flat.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const handleCreateFlat = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !flatName) return;

    try {
      mutate({ name: flatName });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center space-x-2">
      <Label htmlFor="flatName">Create flat</Label>
      <Input 
        type="text"
        id="flatName"
        value={flatName}
        onChange={(event) => setFlatName(event.target.value)}
        disabled={isCreating}
        placeholder="Flat Name" 
      />
      <Button 
        onClick={handleCreateFlat}
        disabled={isCreating}
        variant="default"
      >
        {isCreating ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.add className="mr-2 h-4 w-4" />
        )}
        Create flat
      </Button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

const JoinFlat = () => {
  const { user } = useUser();
  const [flatId, setFlatId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const router = useRouter(); 

  const { mutate, isLoading: isJoining } =
    api.flat.addUserToUserFlat.useMutation({
      onSuccess: (flat) => {
        setSuccessMessage(`Successfully joined flat: ${flat.id}`);
        setFlatId("");
        router.push(`/flat/${flat.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const handleJoinFlat = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !flatId) return;

    try {
      mutate({ id: flatId });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center space-x-2">
      <Label htmlFor="flatId">Join flat</Label>
      <Input 
        type="text"
        id="flatId"
        value={flatId}
        onChange={(event) => setFlatId(event.target.value)}
        disabled={isJoining}
        placeholder="Flat ID" 
      />
      <Button 
        onClick={handleJoinFlat}
        disabled={isJoining}
        variant="default"
      >
        {isJoining ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.add className="mr-2 h-4 w-4" />
        )}
        Join flat
      </Button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default function Dashboard() {
  const user = useUser();
  return (
    <>
      <div className="p-4">
        <h1 className="mb-4 text-2xl">Dashboard view</h1>
      </div>
      <div>
        <JoinFlat />
      </div>
      <div>
        <CreateFlat />
      </div>
    </>
  );
}
