import React from "react";

export const metadata = {
	title: "Task Management  | SignUp",
	description: "Generated by create next app",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}