import React, {useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {MdOutlineOndemandVideo} from 'react-icons/md';
import {IoMdCloseCircle} from 'react-icons/io';


interface NavbarProps {
    onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({onSearch}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="sticky top-0 z-10 bg-black bg-opacity-95 backdrop-blur-sm p-4">
            <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between w-full h-full md:h-16">

                <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <MdOutlineOndemandVideo size={28} className="text-primary mr-2"/>
                        <div className="text-white font-bold text-xl">Music Tube</div>
                    </div>
                </div>


                <div className=" flex-1 max-w-full md:max-w-xl mx-8">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary border border-gray-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <IoMdCloseCircle size={18}/>
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-black rounded-full p-1.5"
                        >
                            <FaSearch size={18}/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Navbar;