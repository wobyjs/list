import { tw } from 'woby-styled'

export const MenuItem = tw('li')`min-h-[auto] bg-transparent cursor-pointer select-none align-middle appearance-none text-inherit font-normal text-base leading-normal tracking-[0.00938em] flex justify-start items-center relative no-underline box-border whitespace-nowrap m-0 px-4 py-1.5 rounded-none border-0 [outline:0px] hover:no-underline hover:bg-[rgba(0,0,0,0.04)]`
export const ListItem = MenuItem

{/* <div class="min-w-[36px] text-[rgba(0,0,0,0.54)] shrink-0 inline-flex">
            <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 [transition:fill_200m_cubic-bezier(0.4,0,0.2,1)0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentCopyIcon">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
        </div>
        <div class="flex-auto min-w-0 my-0">
            <span class="font-normal text-base leading-normal tracking-[0.00938em] block m-0">Copy</span></div>
        <p class="font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] m-0">⌘C</p>
        <span class="overflow-hidden pointer-events-none absolute z-0 rounded-[inherit] inset-0"></span> */}