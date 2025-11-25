import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	const [email, setEmail] = React.useState('');
	const [subscribed, setSubscribed] = React.useState(false);

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (email) {
			setSubscribed(true);
			setEmail('');
			setTimeout(() => setSubscribed(false), 3000);
		}
	};

	return (
		<footer className="bg-white border-t border-gray-300">
			<div className="max-w-7xl mx-auto px-6 py-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
					<div>
						<div className="inline-flex items-center gap-3 mb-4">
							<div className="bg-red-500 text-white px-3 py-1 rounded">UP</div>
							<div className="text-xl font-semibold">STYLE</div>
						</div>
						<div className="text-sm text-gray-700 space-y-2">
							<div>20Masthan Ali Garden Chennai, India.</div>
							<div className="font-medium">(+91)8838506695</div>
							<div>
								<a href="mailto:subashkannan0309@gmail.com" className="text-gray-700 hover:underline">subashkannan0309@gmail.com</a>
							</div>
							<div>
								<a href="mailto:subashkannanramesh@gmail.com" className="text-gray-700 hover:underline">subashkannanramesh@gmail.com</a>
							</div>
						</div>
					</div>

					<div>
						<h4 className="font-semibold mb-3">Delivery Information</h4>
						<ul className="text-sm text-gray-700 space-y-2">
							<li><Link to="#" className="hover:text-red-500">Delivery Information</Link></li>
							<li><Link to="#" className="hover:text-red-500">Privacy Policy</Link></li>
							<li><Link to="#" className="hover:text-red-500">Terms & Condition</Link></li>
							<li><Link to="#" className="hover:text-red-500">Search Terms</Link></li>
							<li><Link to="#" className="hover:text-red-500">Order & Return</Link></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-3">Customer Service</h4>
						<ul className="text-sm text-gray-700 space-y-2">
							<li><Link to="#" className="hover:text-red-500">Customer Service</Link></li>
							<li><Link to="#" className="hover:text-red-500">Privacy Policy</Link></li>
							<li><Link to="#" className="hover:text-red-500">Terms & Condition</Link></li>
							<li><Link to="#" className="hover:text-red-500">Best Seller</Link></li>
							<li><Link to="#" className="hover:text-red-500">Manufactures</Link></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-3">Operating Hours</h4>
						<div className="text-sm text-gray-700 space-y-2 mb-4">
							<div className="flex justify-between"><span>Monday - Friday</span><span>08:00 - 20:00</span></div>
							<div className="flex justify-between"><span>Saturday</span><span>09:00 - 21:00</span></div>
							<div className="flex justify-between"><span>Sunday</span><span>13:00 - 22:00</span></div>
						</div>

						<form onSubmit={handleSubscribe} className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email here"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none"
								required
							/>
							<button type="submit" className="bg-red-500 text-white px-4 py-2 text-sm rounded">SUBSCRIBE</button>
						</form>
						{subscribed && <p className="text-green-600 text-sm mt-2">Thanks for subscribing!</p>}

						<div className="mt-4 flex items-center gap-3">
							<img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="visa" className="h-6" />
							<img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="mastercard" className="h-6" />
							<img src="https://cdn-icons-png.flaticon.com/512/196/196560.png" alt="paypal" className="h-6" />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 border-t border-gray-200 py-6">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700">
					<div className="mb-3 md:mb-0">MakeYourWP © 2025 — All Right reserved!</div>
					<div className="flex gap-6">
						<Link to="#" className="hover:text-red-500">Privacy & Cookies</Link>
						<Link to="#" className="hover:text-red-500">Terms & Conditions</Link>
						<Link to="#" className="hover:text-red-500">Accessibility</Link>
						<Link to="#" className="hover:text-red-500">Store Directory</Link>
						<Link to="#" className="hover:text-red-500">About Us</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
