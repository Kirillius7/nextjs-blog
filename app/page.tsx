import Image from "next/image";
import { Filters } from "./Filters";
import SideHeader from "./SiteHeader";
export default function Home() {
  return (
    //<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <div className="bg-gray-200 antialiased min-h-screen xl:flex xl:flex-col">
      <SideHeader/>
      <div className="xl:flex xl:flex-1">
        <Filters/>
        <main className="px-4 py-6">
        <div>
          <div className="px-6">
            <div className="flex flex-col">
              <h3 className="text-gray-900 text-xl">Los Angeles</h3>
            </div>
            <p className="text-gray-500 pb-2">Live like the stars in these luxurious Southern California estates</p>
          </div>
          <div className="mt-6 sm:flex sm:gap-4 sm:overflow-x-auto px-4">
            {[1,2,3,4].map((item) => (
          <div key = {item} className="sm:max-w-xs sm:w-full sm:flex-shrink-0 sm:px-2">
            <div>
            <div className="relative aspect-[16/9] bg-black rounded-lg">
              <Image
                src ="/Cali_mansion.jpg"
                alt = "NYC_mansion"
                fill
                className="object-cover rounded-lg shadow-md"      
              />
            </div>
            <div className="relative -mt-16 px-4">
            <div className="bg-white rounded-lg px-4 py-4">
              <div className="flex">
                <span className="px-2 bg-blue-400 text-white font-medium uppercase rounded-lg">Plus</span>
                <div className="ml-2 text-gray-400 font-semibold uppercase">3 beds &middot; 2 baths</div>
              </div>
              <h4 className="mt-2 text-gray-900 text-lg font-semibold">Modern home in the city center</h4>
              <div className="mt-1">
                <span className="text-gray-900">$1.400</span>
                <span className="ml-1 text-gray-400">/wk</span>
              </div>
              <div className="text-sm text-gray-600">
                34 reviews
              </div>
            </div>
            </div>
            </div>
            
          </div>
            ))}
          </div>
        </div>
        <br/>
        <hr/>
        <br/>
        <div>
          <div className="px-6">
            <div className="flex flex-col">
              <h3 className="text-gray-900 text-xl">New York</h3>
            </div>
            <p className="text-gray-500 pb-2">Enjoy the view over the Hudson bay at the top of the finest city`s estates</p>
          </div>
          <div className="mt-6 sm:flex sm:gap-4 sm:overflow-x-auto px-4">
            {[1,2,3,4].map((item) => (
          <div key = {item} className="sm:max-w-xs sm:w-full sm:flex-shrink-0 sm:px-2">
            <div>
            <div className="relative aspect-[16/9] bg-black rounded-lg">
              <Image
                src ="/a new york mansion.jpg"
                alt = "NYC_mansion"
                fill
                className="object-cover rounded-lg shadow-md"      
              />
            </div>
            <div className="relative -mt-16 px-4">
            <div className="bg-white rounded-lg px-4 py-4">
              <div className="flex">
                <span className="px-2 bg-blue-400 text-white font-medium uppercase rounded-lg">Plus</span>
                <div className="ml-2 text-gray-400 font-semibold uppercase">4 beds &middot; 3 baths</div>
              </div>
              <h4 className="mt-2 text-gray-900 text-lg font-semibold">Modern home near the Central Park</h4>
              <div className="mt-1">
                <span className="text-gray-900">$3.400</span>
                <span className="ml-1 text-gray-400">/wk</span>
              </div>
              <div className="text-sm text-gray-600">
                41 reviews
              </div>
            </div>
            </div>
            </div>
            
          </div>
            ))}
          </div>
        </div>
        </main>  
      </div>
    </div>
  );
}
