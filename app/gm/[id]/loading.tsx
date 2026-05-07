// app/gm/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGM() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
     
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32 bg-slate-800" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
       
            <Skeleton className="w-full aspect-square rounded-xl bg-slate-800" />
            
         
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-slate-800" />
                <Skeleton className="h-6 w-24 bg-slate-800" />
              </div>
            
              <Skeleton className="h-10 w-3/4 bg-slate-800" />
             
              <Skeleton className="h-6 w-1/2 bg-slate-800" />
             
              <Skeleton className="h-5 w-full bg-slate-800" />
            </div>

          
            <Skeleton className="h-12 w-full rounded-lg bg-slate-800" />
          </div>
        </div>

       
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-3/4 bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}