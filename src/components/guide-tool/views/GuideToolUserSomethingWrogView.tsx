import { FC, MouseEvent } from "react"
import { LocalizeText } from "../../../api"
import { Button } from "../../../common"

interface GuideToolUserSomethingWrogViewProps
{
    onCloseClick: (event: MouseEvent) => void;
}

export const GuideToolUserSomethingWrogView: FC<GuideToolUserSomethingWrogViewProps> = props =>
{
    const { onCloseClick = null } = props

    return (
        <>
            <p className="text-sm text-[#070707]">{ LocalizeText("guide.help.request.user.guide.disconnected.error.desc") }</p>
            <div className="mt-5 flex gap-[30px]">
                <div className="h-[89px] w-11 bg-[url('/client-assets/images/help/solved.png')] dark:bg-[url('/client-assets/images/help/solved-dark.png')]" />
                <Button onClick={ onCloseClick }>{ LocalizeText("guide.help.request.user.thanks.close.button") }</Button>
            </div>
        </>
    )
}