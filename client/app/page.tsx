// // import Link from "next/link";
// // import { cookies } from "next/headers"; // 👈 import this
// // import Header from "./_component/Header";

// // async function getData() {
// //   const cookieStore = await cookies();
// //   const cookieHeader = cookieStore
// //     .getAll()
// //     .map((c) => `${c.name}=${c.value}`)
// //     .join("; ");



// //   // Make internal API call with cookie
// //   const res = await fetch("http://auth-srv:3000/api/users/currentuser", {
// //     cache: "no-store",
// //     headers: {
// //       Cookie: cookieHeader,
// //     },
// //   });

// //   if (!res.ok) {
// //     return null; // user not logged in
// //   }

// //   return res.json();
// // }

// // export default async function Home() {
// //   const data = await getData();


// //   const currentUser = data?.user;



// //   return (
// //     <>
// //       <Header currentUser={currentUser} />
// //       <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-12 text-center">
// //         <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
// //           Welcome to <span className="text-indigo-600">TicketX</span>
// //         </h1>
// //         <p className="text-lg text-gray-700 max-w-2xl mb-8">
// //           A modern ticketing platform built with microservices, Kubernetes, and Next.js.
// //         </p>

// //         {currentUser ? (
// //           <div className="text-lg text-gray-800 mb-6">
// //             👋 Welcome back, <span className="font-semibold text-indigo-600">{currentUser.name || currentUser.email}</span>!
// //           </div>
// //         ) : null}

// //         <div className="flex gap-4">
// //           {!currentUser && (
// //             <>
// //               <Link
// //                 href="/signup"
// //                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
// //               >
// //                 Get Started
// //               </Link>
// //               <Link
// //                 href="/auth/signin"
// //                 className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
// //               >
// //                 Sign In
// //               </Link>
// //             </>
// //           )}
// //           {currentUser && (
// //             <Link
// //               href="/dashboard"
// //               className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
// //             >
// //               Go to Dashboard
// //             </Link>
// //           )}
// //         </div>

// //         <footer className="mt-12 text-sm text-gray-500">
// //           © {new Date().getFullYear()} TicketX. All rights reserved.
// //         </footer>
// //       </div> </>
// //   );
// // }


// import React from 'react';
// import Image from 'next/image';
// import { Search, Globe, ChevronDown, Play, MapPin, Calendar, Music } from 'lucide-react';

// // --- COMPONENTS ---

// const SectionHeader = ({ title }: { title: string }) => (
//   <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 uppercase tracking-wider">
//     {title}
//   </h2>
// );

// const VinylCard = ({ artist, location, imgUrl }: { artist: string, location: string, imgUrl: string }) => (
//   <div className="group relative flex flex-col items-center cursor-pointer">
//     {/* Vinyl Record Effect */}
//     <div className="relative w-64 h-64 mb-6 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
//       <div className="absolute inset-0 rounded-full bg-black border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
//         {/* Vinyl Grooves simulation */}
//         <div className="absolute inset-0 rounded-full border-[20px] border-zinc-900/50 z-10"></div>
//         <div className="absolute inset-0 rounded-full border-[40px] border-zinc-800/30 z-10"></div>

//         {/* Artist Image */}
//         <div className="relative w-48 h-48 rounded-full overflow-hidden z-20 border-4 border-[#ff2c55]/20">
//           <Image
//             src={imgUrl}
//             alt={artist}
//             fill
//             className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
//           />
//         </div>
//         {/* Center Hole */}
//         <div className="absolute w-4 h-4 bg-black rounded-full z-30 border border-zinc-700"></div>
//       </div>
//     </div>
//     <h3 className="text-xl font-bold text-white">{artist}</h3>
//     <p className="text-sm text-gray-400 mt-1">{location}</p>
//   </div>
// );

// const EventRow = ({ day, month, title, subtitle, location, imgUrl }: any) => (
//   <div className="flex flex-col md:flex-row items-center bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl mb-4 hover:border-[#ff2c55] transition-colors group">
//     <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden mb-4 md:mb-0">
//       <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
//     </div>
//     <div className="flex-1 md:ml-6 text-center md:text-left">
//       <div className="text-[#ff2c55] font-bold text-lg mb-1">
//         <span className="text-2xl">{day}</span> {month}
//       </div>
//       <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
//       <p className="text-gray-400 text-sm">{subtitle}</p>
//       <div className="flex items-center justify-center md:justify-start text-xs text-gray-500 mt-2">
//         <MapPin className="w-3 h-3 mr-1" /> {location}
//       </div>
//     </div>
//     <div className="mt-4 md:mt-0">
//       <button className="w-16 h-16 rounded-full border border-[#ff2c55] text-[#ff2c55] hover:bg-[#ff2c55] hover:text-white transition-all flex items-center justify-center text-xs font-bold text-center leading-tight p-2">
//         Get <br /> Ticket
//       </button>
//     </div>
//   </div>
// );

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff2c55] selection:text-white overflow-x-hidden">

//       {/* --- NAVBAR --- */}
//       <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 md:px-12">
//         <div className="text-2xl font-black tracking-tighter italic">
//           LIVE <span className="text-[#ff2c55]">NATION</span>
//         </div>
//         <div className="hidden md:flex space-x-8 text-xs font-medium uppercase tracking-widest text-gray-300">
//           <a href="#" className="hover:text-white transition-colors">Concerts</a>
//           <a href="#" className="hover:text-white transition-colors">Festivals</a>
//           <a href="#" className="hover:text-white transition-colors">Comedy</a>
//           <a href="#" className="hover:text-white transition-colors">Venues</a>
//         </div>
//         <div className="flex items-center space-x-6">
//           <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
//           <Globe className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
//           <button className="bg-[#ff2c55] text-white px-6 py-2 text-xs font-bold uppercase rounded hover:bg-red-600 transition-colors">
//             Log In
//           </button>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <header className="relative h-[85vh] flex items-center justify-center overflow-hidden">
//         {/* Background Image with Overlay */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//             alt="Concert Crowd"
//             fill
//             className="object-cover opacity-60"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
//         </div>

//         <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-50px]">
//           <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none">
//             OLIVIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">RODRIGO</span>
//           </h1>
//           <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto font-light">
//             Don't miss Olivia Rodrigo's hits live! Secure your seats today for an unforgettable night of music, emotion, and energy.
//           </p>
//           <button className="bg-[#ff2c55] hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,44,85,0.5)]">
//             Ticket On Sale Now
//           </button>
//         </div>

//         {/* Filter Widget */}
//         <div className="absolute bottom-12 w-full px-4 md:px-0 max-w-4xl z-20">
//           <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6">
//             <div className="text-sm font-semibold text-gray-400 mb-4 uppercase">Shows In The Middle East</div>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-zinc-900/80 border border-zinc-700 rounded px-4 py-3 flex justify-between items-center text-sm text-gray-300 cursor-pointer hover:border-zinc-500">
//                 <span>All Genres</span> <ChevronDown className="w-4 h-4" />
//               </div>
//               <div className="bg-zinc-900/80 border border-zinc-700 rounded px-4 py-3 flex justify-between items-center text-sm text-gray-300 cursor-pointer hover:border-zinc-500">
//                 <span>All Locations</span> <ChevronDown className="w-4 h-4" />
//               </div>
//               <div className="bg-zinc-900/80 border border-zinc-700 rounded px-4 py-3 flex justify-between items-center text-sm text-gray-300 cursor-pointer hover:border-zinc-500">
//                 <span>All Dates</span> <Calendar className="w-4 h-4" />
//               </div>
//               <button className="bg-[#ff2c55] hover:bg-red-600 text-white font-bold uppercase text-sm rounded shadow-lg transition-all">
//                 Find Events
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* --- WHAT'S HAPPENING --- */}
//       <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
//         <SectionHeader title="What's Happening?" />
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
//           <VinylCard
//             artist="Ed Sheeran"
//             location="Live At Coca-Cola Arena"
//             imgUrl="https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=1000&auto=format&fit=crop"
//           />
//           <VinylCard
//             artist="Selena Gomez"
//             location="Live At Etihad Arena"
//             imgUrl="https://images.unsplash.com/photo-1520785643438-5bf77931f493?q=80&w=1000&auto=format&fit=crop"
//           />
//           <VinylCard
//             artist="DJ Snake"
//             location="Live At Coca-Cola Arena"
//             imgUrl="https://images.unsplash.com/photo-1571266028243-371695039980?q=80&w=1000&auto=format&fit=crop"
//           />
//         </div>
//       </section>

//       {/* --- COMEDY SECTION (Red Background) --- */}
//       <section className="bg-[#ff2c55] text-white py-24 relative overflow-hidden">
//         {/* Decorative Elements */}
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500 rounded-full blur-[100px] opacity-50 pointer-events-none" />

//         <div className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row items-center gap-12">

//           {/* List Side */}
//           <div className="w-full md:w-1/2 z-10">
//             <h2 className="text-4xl font-black mb-2 uppercase">The Home Of Comedy</h2>
//             <p className="text-red-100 mb-10 text-sm max-w-md">
//               Iconic venues like the Comedy Store have launched the careers of countless comedians, Chris Rock, and Amy Schumer.
//             </p>

//             <div className="space-y-0">
//               {[
//                 { id: '01', name: 'Ed Sheeran', date: '12 June' },
//                 { id: '02', name: 'Selena Gomez', date: '15 June' },
//                 { id: '03', name: 'Dave Chappelle', date: '20 June', active: true },
//                 { id: '04', name: 'Tommy & Bridgeman', date: '24 June' },
//               ].map((item) => (
//                 <div
//                   key={item.id}
//                   className={`flex items-center justify-between py-6 border-b border-white/30 cursor-pointer transition-all hover:pl-4 group ${item.active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
//                 >
//                   <div className="flex items-center gap-6">
//                     <span className="font-mono text-sm opacity-60">{item.id}</span>
//                     <span className={`text-xl font-bold ${item.active ? 'text-white scale-110 origin-left' : 'group-hover:scale-105 origin-left transition-transform'}`}>{item.name}</span>
//                   </div>
//                   <span className="text-sm font-mono">{item.date}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Image Side */}
//           <div className="w-full md:w-1/2 relative z-10 h-[500px] flex items-center justify-center">
//             <div className="relative w-80 h-[400px] md:w-[400px] md:h-[500px] transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out shadow-2xl">
//               <div className="absolute inset-0 border-2 border-white rounded-2xl z-20 translate-x-4 translate-y-4"></div>
//               <Image
//                 src="https://images.unsplash.com/photo-1583795489782-ad16b2289446?q=80&w=1000&auto=format&fit=crop"
//                 alt="Dave Chappelle Comedy"
//                 fill
//                 className="object-cover rounded-2xl z-10 grayscale contrast-125"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#ff2c55] to-transparent z-20 opacity-60 rounded-2xl mix-blend-multiply"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- PAST SHOWS (Video Style) --- */}
//       <section className="py-24 px-6 md:px-20 max-w-7xl mx-auto bg-zinc-950/50">
//         <SectionHeader title="Our Past Shows" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* Main Video */}
//           <div className="lg:col-span-2 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
//             <Image
//               src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop"
//               alt="Main Video"
//               fill
//               className="object-cover transition-transform duration-700 group-hover:scale-105"
//             />
//             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
//             <div className="absolute bottom-8 left-8 z-20">
//               <span className="bg-[#ff2c55] text-xs font-bold px-2 py-1 rounded mb-2 inline-block">LIVE NATION</span>
//               <h3 className="text-2xl md:text-4xl font-bold">Wireless Festival Middle East</h3>
//               <p className="text-gray-300 mt-2 text-sm max-w-lg line-clamp-2">Music event promises to be an exhilarating continuation of the vibrant energy that defines...</p>
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
//               <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50">
//                 <Play className="w-8 h-8 text-white fill-current ml-1" />
//               </div>
//             </div>
//           </div>

//           {/* Side List */}
//           <div className="flex flex-col space-y-4 h-full">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
//                 <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
//                   <Image
//                     src={`https://images.unsplash.com/photo-${i === 1 ? '1470225620780-dba8ba36b745' : i === 2 ? '1501386761578-eac5f94f801e' : '1511671782779-c97d3d27a1d4'}?q=80&w=400&auto=format&fit=crop`}
//                     alt="Thumbnail"
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                     <Play className="w-4 h-4 text-white fill-white" />
//                   </div>
//                 </div>
//                 <div className="flex flex-col justify-center">
//                   <h4 className="font-bold text-sm group-hover:text-[#ff2c55] transition-colors">Imagine Dragons Live</h4>
//                   <p className="text-xs text-gray-500 mt-1">At Etihad Arena</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* --- NEW RELEASES (Vinyl Style 2) --- */}
//       <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto border-t border-zinc-900">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">New Releases Music</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//           <VinylCard artist="Zayn Malik" location="Still Got Time - Etihad Arena" imgUrl="https://images.unsplash.com/photo-1621360841013-c768371e93cf?q=80&w=800&auto=format&fit=crop" />
//           <VinylCard artist="Neha Kakkar" location="Puchda Hi Nahin - Etihad Arena" imgUrl="https://images.unsplash.com/photo-1601379201420-60101f77433e?q=80&w=800&auto=format&fit=crop" />
//           <VinylCard artist="Justin Bieber" location="Under The Mistletoe - Etihad Arena" imgUrl="https://images.unsplash.com/photo-1504863562483-a89c9f265425?q=80&w=800&auto=format&fit=crop" />
//         </div>
//       </section>

//       {/* --- UPCOMING EVENTS LIST --- */}
//       <section className="py-20 px-6 md:px-20 max-w-4xl mx-auto">
//         <SectionHeader title="Our Upcoming Events" />

//         {/* Month Header */}
//         <div className="text-gray-400 font-bold uppercase tracking-widest mb-6 mt-10">June 2024</div>
//         <EventRow
//           day="07" month="June"
//           title="Shongololo Shuffle: Desert Edition"
//           subtitle="Dewald Wasserfall, Ampie, Early B"
//           location="Millennium Al Rawdah Hotel | Abu Dhabi"
//           imgUrl="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop"
//         />
//         <EventRow
//           day="10" month="June"
//           title="Amr Diab"
//           subtitle="Amr Diab Live Concert"
//           location="Coca-Cola Arena | Dubai"
//           imgUrl="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop"
//         />

//         <div className="text-gray-400 font-bold uppercase tracking-widest mb-6 mt-12">July 2024</div>
//         <EventRow
//           day="05" month="July"
//           title="Cigarettes After Sex"
//           subtitle="Cigarettes After Sex Live"
//           location="Audi 2 | New Delhi"
//           imgUrl="https://images.unsplash.com/photo-1574155376612-8fa278560085?q=80&w=1000&auto=format&fit=crop"
//         />
//       </section>

//       {/* --- FOOTER CTA --- */}
//       <section className="relative py-32 bg-zinc-900 overflow-hidden flex items-center justify-center border-t border-zinc-800">
//         {/* Background Texture */}
//         <div className="absolute inset-0 opacity-20">
//           <Image src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" alt="Crowd" fill className="object-cover grayscale" />
//         </div>

//         <div className="relative z-10 text-center px-4">
//           <h2 className="text-4xl md:text-6xl font-black uppercase mb-2 tracking-tighter">
//             Grab Your Unfold
//           </h2>
//           <h2 className="text-4xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-8 tracking-tighter">
//             2024 Tickets
//           </h2>
//           <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm">
//             Join the industry's brightest thinkers for an unforgettable day of inspiration. Let's shape hospitality's future together.
//           </p>

//           <div className="absolute right-[10%] md:right-[20%] top-1/2 -translate-y-1/2 hidden lg:block">
//             <button className="w-32 h-32 rounded-full bg-[#ff2c55] hover:bg-red-600 text-white font-bold flex items-center justify-center text-xl shadow-[0_0_50px_rgba(255,44,85,0.4)] transition-all hover:scale-110 animate-pulse">
//               Get Your <br /> Ticket
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="bg-black border-t border-zinc-900 py-8 px-6 md:px-12">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="text-xl font-black italic">
//             LIVE <span className="text-[#ff2c55]">NATION</span>
//           </div>

//           <div className="flex space-x-6 text-xs text-gray-500 uppercase font-medium">
//             <a href="#" className="hover:text-white">Terms of Use</a>
//             <a href="#" className="hover:text-white">Cookies</a>
//             <a href="#" className="hover:text-white">Privacy Policy</a>
//           </div>

//           <div className="flex space-x-4">
//             <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-[#ff2c55] hover:text-white cursor-pointer transition-colors">
//               <Globe className="w-4 h-4" />
//             </div>
//             <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 hover:bg-[#ff2c55] hover:text-white cursor-pointer transition-colors">
//               <Music className="w-4 h-4" />
//             </div>
//           </div>
//         </div>
//         <div className="text-center md:text-right mt-4 text-[10px] text-gray-700">
//           © 2024 Web. Inc All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }

