import { FC } from "react"
import { BaseProps } from ".."

interface LayoutTimesViewProps extends BaseProps<HTMLDivElement>
{
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const LayoutTimesView: FC<LayoutTimesViewProps> = ({ onClick }) =>
{
    return (
        <i className="block size-5 cursor-pointer bg-[url('/client-assets/images/spritesheet.png')] dark:bg-[url('/client-assets/images/spritesheet-dark.png')] bg-[0_-202px] hover:bg-[-21px_-202px] active:bg-[-42px_-202px]" onClick={ onClick } />
    )
}
