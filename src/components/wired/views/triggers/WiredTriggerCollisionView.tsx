import { FC } from "react"
import { WiredFurniType } from "../../../../api"
import { WiredTriggerBaseView } from "./WiredTriggerBaseView"

export const WiredTriggerCollisionView: FC<{}> = props =>
{
    return <WiredTriggerBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ false } save={ null } />
}
