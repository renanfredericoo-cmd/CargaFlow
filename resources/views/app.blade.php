<!DOCTYPE html>

<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

    <head>

        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta property="og:title" content="CargaFlow">
        <meta property="og:description" content="Gestão inteligente de cargas, equipes e resultados.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://cargaflow.app.br">
        <meta property="og:image" content="https://cargaflow.app.br/images/cargaflow-share-v2.jpg">

        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="CargaFlow">
        <meta name="twitter:description" content="Gestão inteligente de cargas, equipes e resultados.">
        <meta name="twitter:image" content="https://cargaflow.app.br/images/cargaflow-share-v2.jpg">

        {{-- Favicons --}}
        <link rel="icon" href="/favicon.ico?v=3" sizes="any">
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml">

        {{-- Android / PWA --}}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=1">
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png?v=1">

        {{-- iPhone / iPad --}}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3">

        {{-- Manifesto --}}
        <link rel="manifest" href="/manifest.webmanifest?v=1">

        {{-- Cor do navegador / Android --}}
        <meta name="theme-color" content="#2563eb">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @fonts

        @viteReactRefresh

        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        <x-inertia::head>
            <title>CargaFlow</title>
        </x-inertia::head>

    </head>

    <body class="font-sans antialiased">

        <x-inertia::app />

    </body>

</html>