import { auth } from "@clerk/nextjs/server";
import MainHeader from "./_components/Header/main-header";
import getCurrentUser from "@/lib/current-user";
import MainBody from "./_components/main-body";

const MarketLayout = async (
    {children} : {children: React.ReactNode}
) => {

    const getUser = await getCurrentUser()

    return ( 
        <div className="flex flex-col w-full h-full bg-white">
            <MainHeader user={getUser} />
            {children}
            <MainBody user={getUser} />
        </div>
     );
}
 
export default MarketLayout;    