import { NavigatorSearchResultList } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { GetConfiguration, LocalizeText, NavigatorSearchResultViewDisplayMode } from "../../../../api"
import { NavigatorSearchResultItemView } from "./NavigatorSearchResultItemView"

export interface NavigatorSearchResultViewProps
{
    searchResult: NavigatorSearchResultList;
}

export const NavigatorSearchResultView: FC<NavigatorSearchResultViewProps> = props =>
{
    const { searchResult = null, ...rest } = props
    const [ isExtended, setIsExtended ] = useState(true)
    const [ displayMode, setDisplayMode ] = useState<number>(0)

    const getResultTitle = () =>
    {
        let name = searchResult.code

        if(!name || !name.length || LocalizeText("navigator.searchcode.title." + name) === ("navigator.searchcode.title." + name)) return searchResult.data

        if(name.startsWith("${")) return name.slice(2, (name.length - 1))

        return ("navigator.searchcode.title." + name)
    }

    const toggleDisplayMode = () =>
    {
        setDisplayMode(prevValue => {
            const newDisplayMode =
                prevValue === NavigatorSearchResultViewDisplayMode.LIST
                    ? NavigatorSearchResultViewDisplayMode.THUMBNAILS
                    : NavigatorSearchResultViewDisplayMode.LIST

            sessionStorage.setItem(getResultTitle(), newDisplayMode.toString())

            return newDisplayMode
        })
    }
    
    useEffect(() => {
        if (!searchResult) return

        setIsExtended(!searchResult.closed)

        const storedDisplayMode = sessionStorage.getItem(getResultTitle())

        if (storedDisplayMode !== null) {
            setDisplayMode(parseInt(storedDisplayMode))
        } else {
            setDisplayMode(searchResult.mode)
        }
    }, [ searchResult ])

    const gridHasTwoColumns = (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS)
    const navigatorType = GetConfiguration<string>("illumina.navigator.type")
    
    return (
        <div className="mb-3 flex flex-col">
            { navigatorType === "r63Large" &&
                <div className="illumina-card-item mb-[5px] flex w-full cursor-pointer items-center justify-between px-[9px] py-1.5">
                    <div className="flex w-full items-center gap-[5px]" onClick={ event => setIsExtended(prevValue => !prevValue) }>
                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(getResultTitle()) }</p>
                    </div>
                    <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-269px_-23px] bg-no-repeat" />
                </div> }
            { navigatorType !== "r63Large" &&
                <div className="illumina-navigator-category-header mb-[5px] flex w-full cursor-pointer items-center justify-between px-[9px] py-1.5">
                    <div className="flex w-full items-center gap-[5px]" onClick={ event => setIsExtended(prevValue => !prevValue) }>
                        { isExtended && <i className="size-2.5 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-230px_0px]" /> }
                        { !isExtended && <i className="size-2.5 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-219px_0px]" /> }
                        <p className="text-[13px] font-semibold text-[#00577E] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(getResultTitle()) }</p>
                    </div>
                    <div>
                        { (displayMode === NavigatorSearchResultViewDisplayMode.LIST) && <i className="block size-[11px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-195px_0px]" onClick={ toggleDisplayMode } /> }
                        { (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS) && <i className="block size-[11px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-207px_0px]" onClick={ toggleDisplayMode } /> }
                    </div>
                </div> }
            { isExtended && <>
                { navigatorType === "default" && <>
                    { gridHasTwoColumns
                        ? <div className="grid grid-cols-3 gap-2">
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } thumbnail={ true } />) }
                        </div>
                        : <div className="grid grid-cols-1">
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } />) }
                        </div>}
                </> }
                { (navigatorType === "r63" || navigatorType === "r63Large") && <>
                    { gridHasTwoColumns
                        ? <>
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } thumbnail={ true } />) }
                        </>
                        : <>
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } />) }
                        </> }
                </> }
            </> }
        </div>
    )
}
