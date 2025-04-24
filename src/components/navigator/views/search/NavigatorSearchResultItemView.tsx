import { RoomDataParser } from "@nitrots/nitro-renderer"
import { FC, MouseEvent } from "react"
import { CreateRoomSession, DoorStateType, GetConfiguration, GetSessionDataManager, LocalizeText, TryVisitRoom } from "../../../../api"
import { LayoutBadgeImageView, LayoutGridItemProps, LayoutRoomThumbnailView } from "../../../../common"
import { useNavigator } from "../../../../hooks"
import { NavigatorSearchResultItemInfoView } from "./NavigatorSearchResultItemInfoView"

export interface NavigatorSearchResultItemViewProps extends LayoutGridItemProps
{
    roomData: RoomDataParser
    thumbnail?: boolean
}

export const NavigatorSearchResultItemView: FC<NavigatorSearchResultItemViewProps> = props =>
{
    const { roomData = null, children = null, thumbnail = false, ...rest } = props
    const { setDoorData = null } = useNavigator()
    const navigatorType = GetConfiguration<string>("illumina.navigator.type")

    const getUserCounterColor = (isOldStyle: boolean) =>
    {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount))

        let bg = isOldStyle ? "-208px -302px" : "-105px -23px"

        if(isOldStyle) {
            if(num >= 92)
            {
                bg = "-313px -302px"
            }
            else if(num >= 50)
            {
                bg = "-278px -302px"
            }
            else if(num > 0)
            {
                bg = "-243px -302px"
            }
        } else {
            if(num >= 92)
            {
                bg = "-228px -23px"
            }
            else if(num >= 50)
            {
                bg = "-187px -23px"
            }
            else if(num > 0)
            {
                bg = "-146px -23px"
            }
        }

        return bg
    }

    const visitRoom = (event: MouseEvent) =>
    {
        if(roomData.ownerId !== GetSessionDataManager().userId)
        {
            if(roomData.habboGroupId !== 0)
            {
                TryVisitRoom(roomData.roomId)

                return
            }

            switch(roomData.doorMode)
            {
            case RoomDataParser.DOORBELL_STATE:
                setDoorData(prevValue =>
                {
                    const newValue = { ...prevValue }
        
                    newValue.roomInfo = roomData
                    newValue.state = DoorStateType.START_DOORBELL
        
                    return newValue
                })
                return
            case RoomDataParser.PASSWORD_STATE:
                setDoorData(prevValue =>
                {
                    const newValue = { ...prevValue }
        
                    newValue.roomInfo = roomData
                    newValue.state = DoorStateType.START_PASSWORD
        
                    return newValue
                })
                return
            }
        }
        
        CreateRoomSession(roomData.roomId)
    }

    if(thumbnail && navigatorType === "r63Large") return (
        <div onClick={ visitRoom } className="relative h-[67px] w-full cursor-pointer overflow-hidden" { ...rest }>
            <div className="flex size-full gap-3">
                <LayoutRoomThumbnailView roomId={ roomData.roomId } customUrl={ roomData.officialRoomPicRef } type="r63Large" isNavigator={ true } />
                <div className="absolute bottom-1.5 right-1.5">
                    <p className="illumina-navigator-room-rectangle-thumbnail-room-name inline-block break-words px-2.5 py-1 font-volter_bold text-[8px] text-white">
                        { roomData.roomName }
                    </p>
                </div>
                <div className="illumina-navigator-room-rectangle-thumbnail absolute left-0 top-0 z-10 size-full" />
            </div>
        </div>
    )

    if(!thumbnail && navigatorType === "r63Large") return (
        <div onClick={ visitRoom } className="illumina-card relative mb-1 w-full cursor-pointer overflow-hidden pb-1.5 pt-2.5" { ...rest }>
            <div className="flex w-full gap-3 px-1.5">
                <div className="flex-1">
                    <p className="line-clamp-1 break-words text-xs font-semibold text-[#010101] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                        { roomData.roomName }
                    </p>
                    <div className="my-1 h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    <p className="text-xs !leading-3 text-[#010101] [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ roomData.ownerName?.length > 0
                        ? `${ LocalizeText("room.tool.room.owner.prefix") } ${roomData.ownerName}`
                        : `${ LocalizeText("navigator.navibutton.11") }` }
                    </p>
                </div>
                { roomData.habboGroupId > 0 && <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } isGroup={ true } /> }
                <div className="flex flex-col items-center gap-1">
                    <i className="h-[22px] w-[25px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-209px_-272px]" />
                    <div className="relative h-[13px] w-[34px] shrink-0 self-end bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: getUserCounterColor(true) }}>
                        <p className="absolute -top-px left-5 font-volter text-[8px] text-white">{ roomData.userCount }</p>
                    </div>
                </div>
            </div>
        </div>
    )

    if(thumbnail && navigatorType === "r63") return (
        <div onClick={ visitRoom } className="illumina-navigator-room-grid max-h-[153px] cursor-pointer overflow-hidden p-[7px]" { ...rest }>
            <div className="flex w-full gap-3">
                <LayoutRoomThumbnailView roomId={ roomData.roomId } customUrl={ roomData.officialRoomPicRef } className="flex flex-col items-center justify-end rounded-md" type="r63">
                    { roomData.habboGroupId > 0 && (
                        <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } isGroup={ true } className={ "absolute left-0 top-0 m-1" }/>) }
                    { roomData.doorMode !== RoomDataParser.OPEN_STATE && (
                        <i className="absolute bottom-0 right-0 mb-1 me-1 h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />) }
                </LayoutRoomThumbnailView>
                <div className="flex w-full grow flex-col justify-between overflow-hidden">
                    <div>
                        <p className="mb-[3px] inline-block break-words text-xs font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                            { roomData.roomName }
                        </p>
                        <p className="line-clamp-2 break-words text-xs text-[#808080]">
                            { roomData.description }
                        </p>
                    </div>
                    <div className="relative h-[13px] w-[34px] shrink-0 self-end bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: getUserCounterColor(true) }}>
                        <p className="absolute left-5 top-0 font-volter text-[8px] text-white">{ roomData.userCount }</p>
                    </div>
                </div>
            </div>
        </div>
    )

    if(thumbnail) return (
        <div onClick={ visitRoom } className="illumina-navigator-room max-h-[153px] cursor-pointer overflow-hidden p-[7px]" { ...rest }>
            <LayoutRoomThumbnailView roomId={ roomData.roomId } customUrl={ roomData.officialRoomPicRef } className="relative mb-1 flex flex-col items-center justify-end" isRoom={true}>
                { roomData.habboGroupId > 0 && <LayoutBadgeImageView badgeCode={ roomData.groupBadgeCode } isGroup={ true } className={ "absolute left-0 top-0 m-1" } /> }
                <div className="absolute bottom-[3px] left-8 h-[18px] w-10 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: getUserCounterColor(false) }}>
                    <p className="absolute left-[26px] top-0.5 text-xs font-semibold text-white">{ roomData.userCount }</p>
                </div>
                {(roomData.doorMode !== RoomDataParser.OPEN_STATE) && (
                    <i className="absolute bottom-0 right-0 mb-1 me-1 h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />) }
            </LayoutRoomThumbnailView>
            <div className="flex w-full">
                <p className="w-4/5 overflow-hidden text-xs">{ roomData.roomName }</p>
                <NavigatorSearchResultItemInfoView roomData={ roomData } />
                { children } 
            </div>
        </div>
    )

    return (
        <div onClick={ visitRoom } className="navigator-item illumina-navigator-room-grid flex cursor-pointer items-center gap-1 px-2 py-1" { ...rest }>
            <div className="relative h-[18px] w-10 shrink-0 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: getUserCounterColor(false) }}>
                <p className="absolute left-[26px] top-0.5 text-xs font-semibold text-white">{ roomData.userCount }</p>
            </div>
            <p className="w-full truncate text-xs">{ roomData.roomName }</p>
            <div className="flex items-center gap-1">
                {(roomData.doorMode !== RoomDataParser.OPEN_STATE) && (
                    <i className="h-4 w-[13px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')]" style={{ backgroundPosition: (roomData.doorMode === RoomDataParser.DOORBELL_STATE ? "-260px 0px" : roomData.doorMode === RoomDataParser.PASSWORD_STATE ? "-274px 0px" : roomData.doorMode === RoomDataParser.INVISIBLE_STATE ? "-288px 0px" : "") }} />) }
                { roomData.habboGroupId > 0 && <i className="h-[11px] w-[13px] bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-321px_0px]" /> }
                <NavigatorSearchResultItemInfoView roomData={ roomData } />
            </div>
            { children }
        </div>
    )
}
