import { FurnitureExchangeComposer, RoomEngineTriggerWidgetEvent, RoomObjectVariable } from "@nitrots/nitro-renderer"
import { useState } from "react"
import { GetRoomEngine, GetRoomSession, IsOwnerOfFurniture } from "../../../../api"
import { useRoomEngineEvent } from "../../../events"
import { useFurniRemovedEvent } from "../../engine"

const useFurnitureExchangeWidgetState = () =>
{
    const [ objectId, setObjectId ] = useState(-1)
    const [ category, setCategory ] = useState(-1)
    const [ value, setValue ] = useState(0)

    const onClose = () =>
    {
        setObjectId(-1)
        setCategory(-1)
        setValue(0)
    }

    const redeem = () =>
    {
        GetRoomSession().connection.send(new FurnitureExchangeComposer(objectId))

        onClose()
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.REQUEST_CREDITFURNI, event =>
    {
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category)

        if(!roomObject || !IsOwnerOfFurniture(roomObject)) return

        setObjectId(event.objectId)
        setCategory(event.category)
        setValue(roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_CREDIT_VALUE) || 0)
    })

    useFurniRemovedEvent(((objectId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== objectId) || (event.category !== category)) return

        onClose()
    })

    return { objectId, value, redeem, onClose }
}

export const useFurnitureExchangeWidget = useFurnitureExchangeWidgetState
