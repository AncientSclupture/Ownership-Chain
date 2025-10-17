import { Instagram, Store, Twitter } from "lucide-react"

export function FooterNavigation() {
    return (
        <div className="p-10 background-dark text-white space-y-5">
            <div className="flex flex-col md:flex-row items-start md:justify-around space-y-8 md:space-y-0">
                <div className="space-y-3">
                    <div className="flex items-center space-x-5">
                        <Store size={50} />
                        <p className="text-xl">OwnershipChainer</p>
                    </div>
                    <p className="text-gray-400">The premier marketplace for digital assets tokenizations.</p>
                </div>

                <div className="space-y-3">
                    <div>Marketplace</div>
                    <p className="text-gray-400 hover:text-white cursor-pointer">Browse Assets</p>
                    <p className="text-gray-400 hover:text-white cursor-pointer">Dashboard</p>
                    <p className="text-gray-400 hover:text-white cursor-pointer">Action</p>
                </div>

                <div className="space-y-3">
                    <div>Support</div>
                    <p className="text-gray-400 hover:text-white cursor-pointer">About Platform</p>
                    <p className="text-gray-400 hover:text-white cursor-pointer">Contact</p>
                    <p className="text-gray-400 hover:text-white cursor-pointer">FAQ</p>
                </div>

                <div className="space-y-3">
                    <div>Connect</div>
                    <div className="flex items-center space-x-3">
                        <Instagram />
                        <Twitter />
                    </div>
                </div>

            </div>
            <div className="border-b border-gray-700 w-full" />
            <div className="w-full text-center">
                © 2025 AncientSclupture. All rights reserved.
            </div>
        </div>
    );
}