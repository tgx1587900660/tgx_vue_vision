const theme = {
    chalk: {
        backgroundColor: '#161522', // 背景色
        titleColor: '#fff', // 标题颜色
        logoSrc: 'logo_dark.png', // 左上角Logo图标
        themeSrc: 'qiehuan_dark.png', // 切换主题按钮图标
        headerBorderSrc: 'header_border_dark.png' // 顶部边框线
    },
    vintage: {
        backgroundColor: '#F0F1F5',
        titleColor: '#000',
        logoSrc: 'logo_light2.png',
        themeSrc: 'qiehuan_light.png',
        headerBorderSrc: 'header_border_light.png'
    }
}

export function getThemeValue(themeName) {
    return theme[themeName]
}
