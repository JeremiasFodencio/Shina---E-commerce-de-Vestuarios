
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/ajuda" | "/carrinho" | "/checkout" | "/favoritos" | "/pedido" | "/pedido/[id]" | "/produto" | "/produto/[slug]";
		RouteParams(): {
			"/pedido/[id]": { id: string };
			"/produto/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; slug?: string | undefined };
			"/admin": Record<string, never>;
			"/ajuda": Record<string, never>;
			"/carrinho": Record<string, never>;
			"/checkout": Record<string, never>;
			"/favoritos": Record<string, never>;
			"/pedido": { id?: string | undefined };
			"/pedido/[id]": { id: string };
			"/produto": { slug?: string | undefined };
			"/produto/[slug]": { slug: string }
		};
		Pathname(): "/" | "/admin" | "/ajuda" | "/carrinho" | "/checkout" | "/favoritos" | `/pedido/${string}` & {} | `/produto/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}