import { CallForHelpTopicData, DefaultSanctionMessageComposer, ModAlertMessageComposer, ModBanMessageComposer, ModKickMessageComposer, ModMessageMessageComposer, ModMuteMessageComposer, ModTradingLockMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useMemo, useState } from "react"
import { ISelectedUser, LocalizeText, ModActionDefinition, NotificationAlertType, SendMessageComposer } from "../../../../api"
import { Button, DraggableWindowPosition, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useModTools, useNotification } from "../../../../hooks"

interface ModToolsUserModActionViewProps
{
    user: ISelectedUser;
    onCloseClick: () => void;
}

const MOD_ACTION_DEFINITIONS = [
    new ModActionDefinition(1, "Alert", ModActionDefinition.ALERT, 1, 0),
    new ModActionDefinition(2, "Mute 1h", ModActionDefinition.MUTE, 2, 0),
    new ModActionDefinition(3, "Ban 18h", ModActionDefinition.BAN, 3, 0),
    new ModActionDefinition(4, "Ban 7 days", ModActionDefinition.BAN, 4, 0),
    new ModActionDefinition(5, "Ban 30 days (step 1)", ModActionDefinition.BAN, 5, 0),
    new ModActionDefinition(7, "Ban 30 days (step 2)", ModActionDefinition.BAN, 7, 0),
    new ModActionDefinition(6, "Ban 100 years", ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(106, "Ban avatar-only 100 years", ModActionDefinition.BAN, 6, 0),
    new ModActionDefinition(101, "Kick", ModActionDefinition.KICK, 0, 0),
    new ModActionDefinition(102, "Lock trade 1 week", ModActionDefinition.TRADE_LOCK, 0, 168),
    new ModActionDefinition(104, "Lock trade permanent", ModActionDefinition.TRADE_LOCK, 0, 876000),
    new ModActionDefinition(105, "Message", ModActionDefinition.MESSAGE, 0, 0)
]

export const ModToolsUserModActionView: FC<ModToolsUserModActionViewProps> = props =>
{
    const { user = null, onCloseClick = null } = props
    const [ selectedTopic, setSelectedTopic ] = useState(-1)
    const [ selectedAction, setSelectedAction ] = useState(-1)
    const [ message, setMessage ] = useState<string>("")
    const { cfhCategories = null, settings = null } = useModTools()
    const { simpleAlert = null } = useNotification()

    const topics = useMemo(() =>
    {
        const values: CallForHelpTopicData[] = []

        if(cfhCategories && cfhCategories.length)
        {
            for(const category of cfhCategories)
            {
                for(const topic of category.topics) values.push(topic)
            }
        }

        return values
    }, [ cfhCategories ])

    const sendAlert = (message: string) => simpleAlert(message, NotificationAlertType.DEFAULT, null, null, "Error")

    const sendDefaultSanction = () =>
    {
        let errorMessage: string = null

        const category = topics[selectedTopic]

        if(selectedTopic === -1) errorMessage = "You must select a CFH topic"

        if(errorMessage) return sendAlert(errorMessage)

        const messageOrDefault = (message.trim().length === 0) ? LocalizeText(`help.cfh.topic.${ category.id }`) : message

        SendMessageComposer(new DefaultSanctionMessageComposer(user.userId, selectedTopic, messageOrDefault))
        
        onCloseClick()
    }

    const sendSanction = () =>
    {
        let errorMessage: string = null

        const category = topics[selectedTopic]
        const sanction = MOD_ACTION_DEFINITIONS[selectedAction]

        if((selectedTopic === -1) || (selectedAction === -1)) errorMessage = "You must select a CFH topic and Sanction"
        else if(!settings || !settings.cfhPermission) errorMessage = "You do not have permission to do this"
        else if(!category) errorMessage = "You must select a CFH topic"
        else if(!sanction) errorMessage = "You must select a sanction"

        if(errorMessage)
        {
            sendAlert(errorMessage)
            
            return
        }

        const messageOrDefault = (message.trim().length === 0) ? LocalizeText(`help.cfh.topic.${ category.id }`) : message

        switch(sanction.actionType)
        {
        case ModActionDefinition.ALERT: {
            if(!settings.alertPermission)
            {
                sendAlert("You have insufficient permissions")

                return
            }

            SendMessageComposer(new ModAlertMessageComposer(user.userId, messageOrDefault, category.id))
            break
        }
        case ModActionDefinition.MUTE: 
            SendMessageComposer(new ModMuteMessageComposer(user.userId, messageOrDefault, category.id))
            break
        case ModActionDefinition.BAN: {
            if(!settings.banPermission)
            {
                sendAlert("You have insufficient permissions")

                return
            }

            SendMessageComposer(new ModBanMessageComposer(user.userId, messageOrDefault, category.id, selectedAction, (sanction.actionId === 106)))
            break
        }
        case ModActionDefinition.KICK: {
            if(!settings.kickPermission)
            {
                sendAlert("You have insufficient permissions")
                return
            }

            SendMessageComposer(new ModKickMessageComposer(user.userId, messageOrDefault, category.id))
            break
        }
        case ModActionDefinition.TRADE_LOCK: {
            const numSeconds = (sanction.actionLengthHours * 60)

            SendMessageComposer(new ModTradingLockMessageComposer(user.userId, messageOrDefault, numSeconds, category.id))
            break
        }
        case ModActionDefinition.MESSAGE: {
            if(message.trim().length === 0)
            {
                sendAlert("Please write a message to user")

                return
            }

            SendMessageComposer(new ModMessageMessageComposer(user.userId, message, category.id))
            break
        }
        }

        onCloseClick()
    }

    if(!user) return null

    return (
        <NitroCardView uniqueKey="mod-tools-user-action" className="illumina-mod-tools-user-action" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={`Mod Action: ${user ? user.username : ""}`} onCloseClick={ () => onCloseClick() } />
            <NitroCardContentView>
                <div className="flex flex-col gap-1.5">
                    <div className="illumina-card-filter relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full text-[13px]" value={ selectedTopic } onChange={ event => setSelectedTopic(parseInt(event.target.value)) }>
                            <option className="!text-black" value={ -1 } disabled>CFH Topic</option>
                            { topics.map((topic, index) => <option className="!text-black" key={ index } value={ index }>{ LocalizeText("help.cfh.topic." + topic.id) }</option>) }
                        </select>
                        <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-269px_-23px] bg-no-repeat" />
                    </div>
                    <div className="illumina-card-filter relative flex h-6 items-center gap-[3px] px-2.5">
                        <select className="w-full text-[13px]" value={ selectedAction } onChange={ event => setSelectedAction(parseInt(event.target.value)) }>
                            <option className="!text-black" value={ -1 } disabled>Sanction Type</option>
                            { MOD_ACTION_DEFINITIONS.map((action, index) => <option className="!text-black" key={ index } value={ index }>{ action.name }</option>) }
                        </select>
                        <i className="pointer-events-none mt-[3px] h-2 w-3 bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[-269px_-23px] bg-no-repeat" />
                    </div>
                    <div className="illumina-input mb-1.5 p-1">
                        <textarea className="illumina-scrollbar h-[46px] w-full !text-[13px]" spellCheck={ false } placeholder="Optional message type, overrides default" value={ message } onChange={ event => setMessage(event.target.value) }/>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <Button className="w-full" onClick={ sendDefaultSanction }>Default Sanction</Button>
                    <Button className="w-full" onClick={ sendSanction }>Sanction</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
