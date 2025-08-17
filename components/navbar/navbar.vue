<template>
    <div class="navbar">
        <NuxtLink to="/" class="navbar-logo">
            <img src="@/assets/logo.svg" alt="Cyber Olam" />
        </NuxtLink>
        <div class="navbar-center">
            <div class="navbar-search">
                <input type="text" placeholder="Search" />
                <img src="@/assets/icons/navbar/search.svg" alt="Search" />
            </div>
            <NuxtLink to="/market" class="navbar-shop-cart">
                Магазин
                <img src="@/assets/icons/navbar/shop.svg" alt="Shop Cart" />
            </NuxtLink>
        </div>
        <div class="navbar-right">
            <div class="navbar-right-item">
                <NuxtLink to="/notifications">
                    <img src="@/assets/icons/navbar/notification.svg" alt="Notification" />
                </NuxtLink>
                <button>
                    <img src="@/assets/icons/navbar/lang.svg" alt="Language" />
                </button>
              
            </div>
            <NuxtLink to="/profile" class="navbar-right-avatar">
                <img src="@/assets/icons/navbar/user.svg" alt="User" />
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
@import "./navbar.css";
</style>