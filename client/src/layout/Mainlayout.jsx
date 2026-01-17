import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

import LogoutPopup from "../component/message/LogoutPopup";

const Mainlayout = () => {
	const [sideOpen, setSideOpen] = useState(false);
	const location = useLocation();

	const [logoutPopup, setLogoutPopup] = useState(false);

	const toggleSideOpen = () => setSideOpen(!sideOpen);

	useEffect(() => {
		setSideOpen(false);
	}, [location.pathname]);

	return (
		<div className="h-dvh flex flex-col bg-gray-100 text-gray-800">
			<Navbar toggleSideOpen={toggleSideOpen} />

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div
					className={`transition-all duration-300 bg-slate-900 text-white
                    fixed top-16 left-0 h-[calc(100dvh-4rem)] w-60 z-50
                    ${sideOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:relative lg:top-0 lg:h-auto lg:block
                `}
				>
					<Sidebar setLogoutPopup={setLogoutPopup} />
				</div>


				{/* Content */}
				<main className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-tl-xl shadow-inner">
					<Outlet />
				</main>
			</div>
			{
				logoutPopup && <LogoutPopup setLogoutPopup={setLogoutPopup} />
			}
		</div>
	);
};

export default Mainlayout;
