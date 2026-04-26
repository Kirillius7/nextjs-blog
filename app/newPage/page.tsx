import Image from "next/image";

export default function Home() {
    return <div className=" antialiased">
            <div className="px-8 py-12 max-w-xl mx-auto lg:max-w-full lg:px-0 lg:py-20 lg:relative lg:min-h-screen">
                <div className="lg:w-7/12 lg:pl-12 lg:pr-8">
                <Image
                    src ="/wrkctn.jpg"
                    alt = "Cali_mansion"
                    width = {300}
                    height = {200}
                    className="rounded-lg" 
                />
                
                <Image
                    src ="/vacation.jpg"
                    alt = "Cali_mansion"
                    width = {450}
                    height = {300}
                    className="sm:w-full h-56 lg:object-cover lg:object-[20%_30%] sm:h-56 rounded-lg mt-8 shadow-xl lg:absolute lg:inset-y-0 lg:right-0 lg:w-5/12 lg:mt-0 lg:h-full lg:shadow-none lg:rounded-none"
                />
                <h1 className = "mt-8 lg:mt-12 text-3xl font-semibold text-gray-900 leading-tight">
                    You can work anywhere.
                    <span className = "text-indigo-500 block sm:inline">Take advantage of it</span>
                </h1>
                <p className = "text-gray-600 text-xl mt-4">
                    Workcation helps you find work-friendly rentals in beautiful locations so you can enjoy some nice weather even when you’re not on vacation.
                </p>
                <div className="mt-6">
                    <a href = "#" className="px-5 py-3 shadow-lg rounded-lg font-semibold bg-indigo-500 hover:bg-indigo-400 text-white uppercase">Book your escape</a>
                </div>
                <h1 className = "mt-10 text-3xl font-semibold text-gray-900 leading-tight">
                    You can work anywhere.
                    <span className = "text-indigo-500 block sm:inline">Take advantage of it</span>
                </h1>
                <p className = "text-gray-600 text-xl mt-4">
                    Workcation helps you find work-friendly rentals in beautiful locations so you can enjoy some nice weather even when you’re not on vacation.
                </p>
                <div className="mt-6">
                    <a href = "#" className="px-5 py-3 shadow-lg rounded-lg font-semibold bg-indigo-500 hover:bg-indigo-400 text-white uppercase">Book your escape</a>
                </div>
            </div>
            </div>
    </div>
}
