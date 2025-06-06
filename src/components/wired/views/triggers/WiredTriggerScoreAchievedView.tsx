import { FC, useEffect, useState } from "react"
import { LocalizeText, WiredFurniType } from "../../../../api"
import { useWired } from "../../../../hooks"
import { WiredRangeView } from "../WiredRangeView"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggeScoreAchievedView: FC<{}> = props =>
{
    const [ points, setPoints ] = useState(1)
    const { trigger = null, setIntParams = null } = useWired()

    const save = () => setIntParams([ points ])

    useEffect(() =>
    {
        setPoints((trigger.intData.length > 0) ? trigger.intData[0] : 0)
    }, [ trigger ])

    return (
        <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <WiredRangeView
                title={ LocalizeText("wiredfurni.params.setscore", [ "points" ], [ points.toString() ]) }
                setState={ setPoints }
                state={ points }
                sliderMin={ 1 }
                sliderMax={ 1000 }
            />
        </WiredTriggerBaseView>
    )
}
