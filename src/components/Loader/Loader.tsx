import React from 'react'
import { Skeleton } from '@heroui/react';

    


export function Loader() {
  return (
    <div className="shadow-panel loader w-[450px] space-y-5 rounded-lg bg-slate-500 bg-transparent p-4">
      <Skeleton className="h-32 rounded-lg bg-slate-500" />
      <div className="space-y-3">
        <Skeleton className="h-40 w-3/5 rounded-lg bg-slate-500" />
        <Skeleton className="h-45 w-49 rounded-lg bg-slate-500" />
        <Skeleton className="h-40 w-2/5 rounded-lg bg-slate-500" />
      </div>
    </div>
  );
}
 
  
