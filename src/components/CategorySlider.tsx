import {useRef, useState} from 'react'
import {useVideoCategories} from '../hooks/useYouTubeApi.ts'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {VideoCategorySliderProps} from "../types/video.ts";


export default function CategorySlider({onCategoryClick}: VideoCategorySliderProps) {
    const {data, isLoading, isError} = useVideoCategories()
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const sliderRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const offset = direction === 'left' ? -200 : 200
            sliderRef.current.scrollBy({left: offset, behavior: 'smooth'})
        }
    }

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category)
        onCategoryClick(category)
    }

    return isLoading ? (
        <div className="flex justify-around gap-4">
            {Array.from({length: 3}).map((_, i) => (
                <div
                    key={i}
                    className="h-8 w-full animate-pulse rounded-full bg-primary-light/50"
                ></div>
            ))}
        </div>

    ) : isError ? (
        <div className="flex justify-center items-center h-14  text-gray-400 rounded-md">
            {'No categories available'}
        </div>
    ) : (
        <div className="relative group">
            <button
                onClick={() => scroll('left')}
                className="absolute  top-1/2 -translate-y-1/2  p-2 rounded-full bg-gray-800 text-white hover:bg-purple-600 transition-opacity duration-300 opacity-0 sm:group-hover:opacity-100  "
            >
                <ChevronLeft size={20}/>
            </button>

            <div
                ref={sliderRef}
                className="flex overflow-x-auto space-x-3 px-3 py-3 scrollbar-hide no-scrollbar"

            >
                {data.map((category:any, i:number) => (
                    <div
                        key={category + i}
                        onClick={() => handleCategoryClick(category)}
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCategoryClick(category)}
                        className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                            activeCategory === category
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'
                        }`}
                    >
                        {category}
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 my-auto top-1/2 -translate-y-1/2  z-10 p-2 rounded-full bg-gray-700 text-white hover:bg-purple-600 transition-opacity duration-300 opacity-0 sm:group-hover:opacity-100   "
            >
                <ChevronRight size={20}/>
            </button>
        </div>
    )
}

