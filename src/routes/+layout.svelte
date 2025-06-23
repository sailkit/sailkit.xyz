<script lang="ts">
  // Stores
  import { page } from '$app/state';
  import { getCurrent } from '$lib/utils/current.svelte';
  import { dev } from '$app/environment';

  // Utils
  import { ModeWatcher, mode } from 'mode-watcher';

  // Components
  import SEO from '$components/SEO.svelte';
  import * as Sidebar from '$components/ui/sidebar';
  import { Button, buttonVariants } from '$components/ui/button';
  import * as Breadcrumb from '$components/ui/breadcrumb';
  import { Separator } from '$components/ui/separator';
  import AppSidebar from '$components/AppSidebar.svelte';
  import { Toaster } from '$lib/components/ui/sonner';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Icons
  import { GithubLogo } from 'svelte-radix';

  // Styles
  import '../styles/app.css';

  let { children } = $props();

  let sidebarState = $state({
    open: true,
    ready: false
  });

  $effect(() => {
    sidebarState.open = localStorage.getItem('sidebar') !== 'false';
    sidebarState.ready = true;
  });

  function handleSidebarChange(open: boolean) {
    sidebarState.open = open;
    localStorage.setItem('sidebar', String(open));
  }
</script>

<svelte:head>
  {#if !dev}
    <script defer data-domain="sailkit.xyz" src="https://plausible.io/js/script.js"></script>
  {/if}
</svelte:head>

<SEO title={getCurrent().doc} url={page.url.toString()} />

<ModeWatcher />

<Toaster position="bottom-center" closeButton />

{#if sidebarState.ready}
  <Sidebar.Provider bind:open={sidebarState.open} onOpenChange={handleSidebarChange}>
    <AppSidebar />
    <Sidebar.Inset>
      <header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Button variant="ghost" class="font-medium">
          <a href="/">⛵SailKit</a>
        </Button>
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb.Root>
          {#if getCurrent().category && getCurrent().doc}
            <Breadcrumb.List>
              <Breadcrumb.Item class="hidden md:block">
                <Breadcrumb.Link>{getCurrent().category}</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="hidden md:block" />
              <Breadcrumb.Item class="hidden md:block">
                <Breadcrumb.Link>{getCurrent().doc}</Breadcrumb.Link>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          {/if}
        </Breadcrumb.Root>
        {#if mode.current}
          <div class="flex flex-1 justify-end gap-2">
            <a
              href="https://github.com/sailkit/sailkit"
              target="_blank"
              class={buttonVariants({ variant: 'outline', size: 'icon', className: 'rounded-full' })}
            >
              <GithubLogo />
            </a>

            <ThemeSwitcher />
          </div>
        {/if}
      </header>

      <main class="flex-1 p-4 md:p-10">
        <div class="mx-auto w-full overflow-hidden">
          {@render children?.()}
        </div>
      </main>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
