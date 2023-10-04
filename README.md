# voby-list



## DEMO

Check out the [documentation &amp; demo](https://github.com/wongchichong/voby-list/) pages to see all use cases.

## Installation

### NPM

```bash
pnpm install voby-list
```

<Details>
<Summary>Usage<Summary>

```tsx
import { MenuItem } from '../src/lib/MenuItem'
import { MenuList } from '../src/lib/MenuList'
import { ListItemIcon } from '../src/lib/ListItemIcon'
import { ListItemSecondaryAction } from '../src/lib/ListItemSecondaryAction'
import { ListItemText } from '../src/lib/ListItemText'
import { tw } from 'voby-styled'

import { render, $ } from 'voby'
import '../dist/output.css'

const Paper = tw('div')`elevation-3`
const Typography = tw('p')`font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] m-0`
const Divider = tw('hr')`shrink-0 my-2 m-0 [border-width:0px_0px_thin] border-solid border-[rgba(0,0,0,0.12)]`
const open = $(false)


{/* <div class="min-w-[36px] text-[rgba(0,0,0,0.54)] shrink-0 inline-flex">
            <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 [transition:fill_200m_cubic-bezier(0.4,0,0.2,1)0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentCopyIcon">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
        </div>
        <div class="flex-auto min-w-0 my-0">
            <span class="font-normal text-base leading-normal tracking-[0.00938em] block m-0">Copy</span></div>
        <p class="font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] m-0">⌘C</p>
        <span class="overflow-hidden pointer-events-none absolute z-0 rounded-[inherit] inset-0"></span> */}

const App = () => <div class='w-[25%]'>
    <div class='w-full w-max-[360px]'>
        <nav>
            <MenuList>
                <MenuItem>
                    <ListItemIcon>
                        <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 text-2xl [transition:fill_200ms_cubic-bezier(0.4,0,0.2,1)0ms]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InboxIcon"><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"></path></svg>
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 text-2xl [transition:fill_200ms_cubic-bezier(0.4,0,0.2,1)0ms]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DraftsIcon"><path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13 3.74 7.84 12 3l8.26 4.84L12 13z"></path></svg>
                    </ListItemIcon>
                    <ListItemText primary="Drafts" secondary="Jan 7, 2014" />
                    {/* <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse> */}
                </MenuItem>
            </MenuList>
        </nav>
        <Divider />
        <nav aria-label="secondary mailbox folders">
            <MenuList>
                <MenuItem>
                    <ListItemText primary="Trash" />
                </MenuItem>
                <MenuItem>
                    <ListItemText primary="Spam" />
                </MenuItem>
            </MenuList>
        </nav>
    </div>

    <Paper class={'w-[320px] w-max-full'}>
        <MenuList>
            <MenuItem>
                <ListItemIcon onClick={() => alert('clickd')}>
                    <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentCutIcon"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"></path></svg>
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography>
                    ⌘X
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentCopyIcon"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography>
                    ⌘C
                </Typography>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ContentPasteIcon"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path></svg>
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
                <Typography>
                    ⌘V
                </Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
                <ListItemIcon>
                    <svg class="select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloudIcon"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path></svg>
                </ListItemIcon>
                <ListItemText>Web Clipboard</ListItemText>
            </MenuItem>
        </MenuList>
    </Paper>
</div>

render(<App />, document.getElementById('app'))
```

</Details>

## API

## License

MIT