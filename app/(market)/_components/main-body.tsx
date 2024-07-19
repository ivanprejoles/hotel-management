'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import HotelMap from "../_components/Map/hotel-map";
import RentListings from "../_components/Listings/rent-listings";
import HomeImage from "../_components/Listings/home-image";
import { Separator } from "@/components/ui/separator";
// import { auth, currentUser } from "@clerk/nextjs/server";
import client from "@/lib/prismadb";
import { $Enums } from "@prisma/client";
import { useRoomDetails } from "@/hooks/use-image-details";
import { userType } from "@/lib/current-user";
import { getStartOfToday } from "@/lib/changeDateTime";
import ReduxProvider from "@/components/providers/redux-provider";
import Sidebar from "@/components/general/sidebar";
import Services from "./Listings/services";
import { FaMapMarkerAlt } from "react-icons/fa";
import VirtualTour from "./Virtual/virtual-tour";
// import CurrentUser from "@/lib/current-user";

export interface roomTypes {
  id: string;
  status: $Enums.RoomStatus;
  reservations: {
      userId: string;
      startDate: Date;
      endDate: Date;
  }[];
}

export interface roomDetailsType {
  title: string;
  description: string;
  value: number;
  bedrooms: number;
  images: string[];
}

interface MainBodyProps {
    user?: userType
}

export default function MainBody({
    user
}: MainBodyProps) {

  return (
    <main className='w-full flex-1 backdrop-blur-sm'>
      <section className="w-full absolute h-full top-0 overflow-hidden">
        <div className="h-full flex dark:bg-[#1F1F1F] relative">
            <Sidebar icon={FaMapMarkerAlt} className="border border-[#0E1725]" width={740}>
              <div className="w-full h-full items-center justify-center">
                <HotelMap />
              </div>
            </Sidebar>
            <main className="flex-1 h-full overflow-y-hidden flex flex-col">
              <ScrollArea className="w-full h-full max-w-full overflow-x-auto top-0 left-0">
                <HomeImage />
                <Separator />
                <Services />
                <ReduxProvider>
                  <RentListings user={user}/>
                </ReduxProvider>
                <VirtualTour />
              </ScrollArea>
            </main>
        </div>
      </section>
    </main>
  );
}
