<template>
                                    <div id="landing" class="h-screen flex flex-col items-center justify-center bg-cover"
                                        >                                    <div class="backdrop-filter backdrop-blur-lg bg-opacity-10 p-10 rounded-xl text-white">
                                            <h1
                                                class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
                                                Natal IA</h1>
                                            <h2 class="text-3xl font-semibold mb-10">Your Intelligent Natural Language Assistant</h2>
                                            <div class="hero text-lg mb-10">
                                                Meet Natalia, your smart assistant designed with the needs of content creators, writers, and professionals
                                                in mind.
                                                Leveraging cutting-edge AI and language models, Natalia provides a sleek, intuitive experience packed with
                                                powerful features.
                                                With Natalia, you can chat, automate resources, plan projects, and more - all from one minimalist interface.
                                            </div>
                                            <div class="cta grid gap-4">
                                                <a href="/chat"
                                                    class="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold">Start
                                                    Chatting with Natalia</a>
                                                <a href="/about"
                                                    class="py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold">Learn
                                                    More About Natalia</a>
                                            </div>
                                        </div>

                                        <footer class="footer mt-10">
                                            <div class="text-center text-white">
                                                <div class="footer__logo">
                                                    <img src="/favicon.svg" alt="Natalia Logo" class="mx-auto my-4 w-20 h-20" />
                                                </div>
                                                (c) 2023 Created by <strong class="text-gradient bg-clip-text from-purple-400 to-red-500">Oscar
                                                    Bahamonde</strong>
                                            </div>
                                    </footer>
                                </div>
</template>

<route lang="yaml">
meta:
  layout: "home"
</route>
