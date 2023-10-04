import { JSX } from 'voby'

type ListType = {
    primary?: JSX.Element
    secondary?: JSX.Element
}

export const ListItemText = ({ primary, secondary, children, ...props }: JSX.HTMLAttributes<HTMLDivElement> & ListType): JSX.Element => <div class="flex-auto min-w-0 my-1.5">
    <span class='font-normal text-base leading-normal tracking-[0.00938em] block m-0'>{primary ?? children}</span>
    <span class='font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] block m-0;'>{secondary}</span>
</div>

