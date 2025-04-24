import { ConvertGlobalRoomIdMessageComposer, HabboWebTools, ILinkEventTracker, LegacyExternalInterface, NavigatorInitComposer, NavigatorSearchComposer, RoomSessionEvent } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer, TryVisitRoom } from "../../api"
import { DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from "../../common"
import { useNavigator, useRoomSessionManagerEvent } from "../../hooks"
import { NavigatorDoorStateView } from "./views/NavigatorDoorStateView"
import { NavigatorRoomCreatorView } from "./views/NavigatorRoomCreatorView"
import { NavigatorRoomInfoView } from "./views/NavigatorRoomInfoView"
import { NavigatorRoomSettingsView } from "./views/room-settings/NavigatorRoomSettingsView"
import { NavigatorSearchResultView } from "./views/search/NavigatorSearchResultView"
import { NavigatorSearchView } from "./views/search/NavigatorSearchView"

export const NavigatorView: FC<{}> = props =>
{
    const [ selectedResult, setSelectedResult ] = useState<Number>(0)
    const [ isVisible, setIsVisible ] = useState(false)
    const [ isReady, setIsReady ] = useState(false)
    const [ isCreatorOpen, setCreatorOpen ] = useState(false)
    const [ isRoomInfoOpen, setRoomInfoOpen ] = useState(false)
    const [ isRoomLinkOpen, setRoomLinkOpen ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ needsInit, setNeedsInit ] = useState(true)
    const [ needsSearch, setNeedsSearch ] = useState(false)
    const { searchResult = null, topLevelContext = null, topLevelContexts = null, navigatorData = null } = useNavigator()
    const pendingSearch = useRef<{ value: string, code: string }>(null)
    const elementRef = useRef<HTMLDivElement>()

    const navigatorType = GetConfiguration<string>("illumina.navigator.type")
    const navigatorBanner: string = GetConfiguration<string>("illumina.navigator.banner")

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event =>
    {
        setIsVisible(false)
        setCreatorOpen(false)
    })

    const NAVIGATOR_SIZE = {
        default: "w-[425px] h-[564px]",
        r63: "w-[400px] h-[564px]",
        r63Large: "w-[315px] h-[456px]"
    }

    const getResultTitle = (result: any) =>
    {
        let name = result.code
        let data = result.data
        if(!name || !name.length || LocalizeText("navigator.searchcode.title." + name) === ("navigator.searchcode.title." + name)) return data

        if(name.startsWith("${")) return name.slice(2, (name.length - 1))

        return ("navigator.searchcode.title." + name)
    }

    const sendSearch = useCallback((searchValue: string, contextCode: string) =>
    {
        SendMessageComposer(new NavigatorSearchComposer(contextCode, searchValue))

        setIsLoading(true)
    }, [])

    const reloadCurrentSearch = useCallback(() =>
    {
        if(!isReady)
        {
            setNeedsSearch(true)

            return
        }

        if(pendingSearch.current)
        {
            sendSearch(pendingSearch.current.value, pendingSearch.current.code)

            pendingSearch.current = null

            return
        }

        if(searchResult)
        {
            sendSearch(searchResult.data, searchResult.code)

            return
        }

        if(!topLevelContext) return

        sendSearch("", topLevelContext.code)
    }, [ isReady, searchResult, topLevelContext, sendSearch ])

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")
        
                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show": {
                    setIsVisible(true)
                    setNeedsSearch(true)
                    return
                }
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle": {
                    if(isVisible)
                    {
                        setIsVisible(false)
        
                        return
                    }
        
                    setIsVisible(true)
                    setNeedsSearch(true)
                    return
                }
                case "toggle-room-info":
                    setRoomInfoOpen(value => !value)
                    return
                case "toggle-room-link":
                    setRoomLinkOpen(value => !value)
                    return
                case "goto":
                    if(parts.length <= 2) return
        
                    switch(parts[2])
                    {
                    case "home":
                        if(navigatorData.homeRoomId <= 0) return
        
                        TryVisitRoom(navigatorData.homeRoomId)
                        break
                    default: {
                        const roomId = parseInt(parts[2])
        
                        TryVisitRoom(roomId)
                    }
                    }
                    return
                case "create":
                    setCreatorOpen(true)
                    return
                case "search":
                    if(parts.length > 2)
                    {
                        const topLevelContextCode = parts[2]
        
                        let searchValue = ""
        
                        if(parts.length > 3) searchValue = parts[3]
        
                        pendingSearch.current = { value: searchValue, code: topLevelContextCode }
        
                        setIsVisible(true)
                        setNeedsSearch(true)
                    }
                    return
                }
            },
            eventUrlPrefix: "navigator/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ isVisible, navigatorData ])

    useEffect(() =>
    {
        if(!searchResult) return

        setIsLoading(false)

        if(elementRef && elementRef.current) elementRef.current.scrollTop = 0
    }, [ searchResult ])

    useEffect(() =>
    {
        if(!isVisible || !isReady || !needsSearch) return

        reloadCurrentSearch()

        setNeedsSearch(false)
    }, [ isVisible, isReady, needsSearch, reloadCurrentSearch ])

    useEffect(() =>
    {
        if(isReady || !topLevelContext) return

        setIsReady(true)
    }, [ isReady, topLevelContext ])

    useEffect(() =>
    {
        if(!isVisible || !needsInit) return

        SendMessageComposer(new NavigatorInitComposer())

        setNeedsInit(false)
    }, [ isVisible, needsInit ])

    useEffect(() =>
    {
        LegacyExternalInterface.addCallback(HabboWebTools.OPENROOM, (k: string, _arg_2: boolean = false, _arg_3: string = null) => SendMessageComposer(new ConvertGlobalRoomIdMessageComposer(k)))
    }, [])

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="navigator" windowPosition={ DraggableWindowPosition.TOP_LEFT } className={`illumina-navigator ${ NAVIGATOR_SIZE[navigatorType] }`}>
                    <NitroCardHeaderView headerText={ LocalizeText("navigator.title") } onCloseClick={ event => setIsVisible(false) } />
                    { isLoading && <div className="absolute left-0 top-0 z-50 size-full rounded-md bg-white/25 dark:bg-black/25" /> }
                    <div className={`${navigatorType === "r63Large" ? "mx-2.5" : "mx-px"}`}>
                        <NitroCardTabsView className={`relative ${navigatorType === "r63Large" ? "!px-0" : ""} ${navigatorType === "default" ? "max-h-[54px] min-h-[54px] border-y border-y-black bg-cover" : ""}`} style={navigatorType === "default" ? { backgroundImage: `url(${navigatorBanner})` } : {}}>
                            <div className="create-room z-10 mr-1 size-fit cursor-pointer pb-[3px]" onClick={ event => setCreatorOpen(true) }>
                                <i className="create-room-icon block size-5 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-174px_0px]" />
                            </div>
                            { topLevelContexts && (topLevelContexts.length > 0) && topLevelContexts.map((context, index) => (
                                <NitroCardTabsItemView key={ index } className={`z-10 ${navigatorType === "r63Large" ? "!font-semibold" : ""}`} isActive={ ((topLevelContext === context)) } onClick={ event => { sendSearch("", context.code), setSelectedResult(0) } }>
                                    { LocalizeText(("navigator.toplevelview." + context.code)) }
                                </NitroCardTabsItemView>
                            ))}
                            { navigatorType === "default" && <div className="absolute left-0 top-0 size-full bg-white/30 dark:bg-[#211d19a3]" /> }
                        </NitroCardTabsView>
                        {navigatorType === "r63Large" && <div className="my-1 mt-2 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" /> }
                    </div>
                    <NitroCardContentView overflow="hidden" className="relative h-full pt-1.5">
                        { LocalizeText(getResultTitle(selectedResult)) }
                        <NavigatorSearchView sendSearch={ sendSearch } />
                        <div ref={ elementRef } className={`illumina-scrollbar ${navigatorType === "r63Large" ? "h-[334px]" : "h-[calc(100%-38px)]"}`}>
                            {searchResult && searchResult.results.map((result, index) => {
                                return <NavigatorSearchResultView key={index} searchResult={result} />
                            })}
                        </div>
                    </NitroCardContentView>
                </NitroCardView> }
            { isCreatorOpen &&
                <NitroCardView uniqueKey="create-room" className="illumina-create-room h-[367px]">
                    <NitroCardHeaderView headerText={ LocalizeText("navigator.createroom.title") } onCloseClick={ event => setCreatorOpen(false) } />
                    <NitroCardContentView position="relative" className="min-h-[334px]">
                        <NavigatorRoomCreatorView onCloseClick={ event => setCreatorOpen(false) } />
                    </NitroCardContentView>
                </NitroCardView> }
            <NavigatorDoorStateView />
            { isRoomInfoOpen && <NavigatorRoomInfoView onCloseClick={ () => setRoomInfoOpen(false) } /> }
            <NavigatorRoomSettingsView />
        </>
    )
}
